import { Container, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Spiner = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('homePage.loading')}</span>
        </Spinner>
      </Row>
    </Container>
  );
};

export default Spiner;
