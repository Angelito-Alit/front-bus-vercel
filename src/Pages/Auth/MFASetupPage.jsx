import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Steps, 
  Form, 
  Input, 
  message, 
  Image,
  Alert
} from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from '../../Components/UI/FormButton';
import authService from '../../services/authService';

const { Title, Text, Paragraph, Link } = Typography;
const { Step } = Steps;

const MFASetupPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.mfaEnabled) {
      message.info('La autenticación de dos factores ya está configurada');
      navigate(user.role === 'administrador' ? '/admin' : '/home');
      return;
    }

    const generateSecret = async () => {
      setLoading(true);
      try {
        const response = await authService.setupMFA();
        setQrCodeUrl(response.qrCodeUrl);
        setSecret(response.secret);
      } catch (error) {
        console.error('Error al generar secreto MFA:', error);
        message.error('No se pudo generar el código QR. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    generateSecret();
  }, [navigate]);
  
  const handleVerify = async (values) => {
    setLoading(true);
    try {
      const response = await authService.verifyAndActivateMFA(values.verificationCode);
      message.success('Autenticación de dos factores activada correctamente');
      setSetupComplete(true);
      setCurrentStep(2);
      
      const user = authService.getCurrentUser();
      if (user) {
        user.mfaEnabled = true;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error al verificar código:', error);
      message.error('Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinue = () => {
    const user = authService.getCurrentUser();
    if (user && user.role === 'administrador') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  };
  
  const steps = [
    {
      title: 'Descargar app',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Paso 1: Descarga Google Authenticator</Title>
          <Paragraph>
            Para configurar la autenticación de dos factores, primero debes descargar la aplicación 
            Google Authenticator en tu dispositivo móvil.
          </Paragraph>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', marginBottom: '20px' }}>
            <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png" 
                alt="Disponible en Google Play" 
                height="40" 
              />
            </a>
            <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/es-mx?size=250x83&amp;releaseDate=1284336000" 
                alt="Descargar en App Store" 
                height="40" 
              />
            </a>
          </div>
          
          <FormButton 
            text="Continuar" 
            loading={loading} 
            onClick={() => setCurrentStep(1)} 
          />
        </div>
      ),
    },
    {
      title: 'Escanear QR',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Paso 2: Escanea el código QR</Title>
          <Paragraph>
            Abre la aplicación Google Authenticator y escanea el siguiente código QR para 
            configurar tu cuenta.
          </Paragraph>
          
          {qrCodeUrl ? (
            <div style={{ margin: '20px 0' }}>
              <Image 
                src={qrCodeUrl} 
                alt="Código QR" 
                style={{ maxWidth: '200px' }} 
                preview={false}
              />
            </div>
          ) : (
            <div style={{ margin: '20px 0' }}>
              <Text type="secondary">Cargando código QR...</Text>
            </div>
          )}
          
          <Alert
            message="¿No puedes escanear el código QR?"
            description={
              <div>
                <Paragraph>
                  Puedes ingresar manualmente el siguiente código en la aplicación:
                </Paragraph>
                <Paragraph>
                  <Text strong copyable>{secret}</Text>
                </Paragraph>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '20px', textAlign: 'left' }}
          />
          
          <Form
            form={form}
            name="verify-mfa"
            onFinish={handleVerify}
            layout="vertical"
          >
            <Form.Item
              name="verificationCode"
              rules={[
                { required: true, message: 'Por favor ingresa el código de verificación' },
                { len: 6, message: 'El código debe tener 6 dígitos' }
              ]}
            >
              <Input 
                placeholder="Código de verificación" 
                maxLength={6}
                style={{ maxWidth: '200px', margin: '0 auto' }}
              />
            </Form.Item>
            
            <Form.Item>
              <FormButton 
                text="Verificar y activar" 
                loading={loading}
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: 'Completado',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>¡Configuración completada!</Title>
          <Paragraph>
            La autenticación de dos factores ha sido activada correctamente. A partir de ahora, 
            necesitarás ingresar un código de verificación cada vez que inicies sesión.
          </Paragraph>
          
          <Alert
            message="Importante"
            description={
              <Paragraph>
                Si pierdes el acceso a tu aplicación de autenticación, no podrás acceder a tu cuenta. 
                Asegúrate de guardar los códigos de respaldo o contacta al soporte para recuperar el acceso.
              </Paragraph>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '20px', textAlign: 'left' }}
          />
          
          <FormButton 
            text="Continuar" 
            onClick={handleContinue}
          />
        </div>
      ),
    },
  ];
  
  return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '30px 20px'
      }}>
        <Card style={{ width: '100%', maxWidth: 600 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
            Configurar autenticación de dos factores
          </Title>
          
          <Steps 
            current={currentStep} 
            items={steps.map(item => ({ title: item.title }))}
            style={{ marginBottom: 30 }}
          />
          
          <div>{steps[currentStep].content}</div>
        </Card>
      </div>
  );
};

export default MFASetupPage;