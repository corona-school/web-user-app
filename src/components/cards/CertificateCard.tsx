import { Button, Select, Space, Tag } from 'antd';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Text from 'antd/lib/typography/Text';
import {
  IExposedCertificate,
  ISupportedLanguage,
  defaultLanguage,
  supportedLanguages,
} from '../../types/Certificate';
import CardWrapper from './Card';
import Context from '../../context';

const StyledCard = styled(CardWrapper)`
  align-items: stretch;
  color: ${(props) => props.theme.colorScheme.gray1};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  min-height: 169px;
  height: auto;
  justify-content: space-evenly;
  text-align: left;
  letter-spacing: -0.333333px;
  line-height: 36px;
  width: 290px;
  position: relative;
  padding: 30px;
`;

const SmallText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
`;

const CardContainer = styled('div')`
  margin: 20px;
`;

function CertificateCard({
  certificate,
  showCertificate,
  startSigning,
}: {
  certificate: IExposedCertificate;
  showCertificate(
    certificate: IExposedCertificate,
    language: ISupportedLanguage
  );
  startSigning(certificate: IExposedCertificate);
}) {
  const userContext = useContext(Context.User);
  const [language, setLanguage] = useState<ISupportedLanguage>(defaultLanguage);

  const showCertificateButton = (
    <>
      <Select
        defaultValue={defaultLanguage}
        onChange={(event) => setLanguage(event)}
        style={{ width: 120 }}
      >
        {Object.entries(supportedLanguages).map(([code, value]) => (
          <Select.Option value={code}>{value}</Select.Option>
        ))}
      </Select>
      <Button
        type="primary"
        onClick={() => showCertificate(certificate, language)}
      >
        Herunterladen
      </Button>
    </>
  );

  const stateToColor = {
    manual: 'grey',
    approved: 'green',
    'awaiting-approval': 'yellow',
  } as const;

  return (
    <CardContainer>
      <StyledCard highlightColor={stateToColor[certificate.state]}>
        <SmallText>Schüler</SmallText>
        <Text>
          {certificate.pupil.firstname} {certificate.pupil.lastname}
        </Text>
        <SmallText>Student</SmallText>
        <Text>
          {certificate.student.firstname} {certificate.student.lastname}
        </Text>
        <Space direction="vertical">
          {userContext.user.isTutor && certificate.state === 'manual' && (
            <>
              <Tag color="grey">manuell bestätigen</Tag>
              {showCertificateButton}
            </>
          )}

          {userContext.user.isTutor && certificate.state === 'approved' && (
            <>
              <Tag color="green">bestätigt!</Tag>
              {showCertificateButton}
            </>
          )}

          {userContext.user.isTutor &&
            certificate.state === 'awaiting-approval' && (
              <Tag color="yellow">noch nicht bestätigt</Tag>
            )}

          {/* <Button danger>Löschen</Button> */}
          {userContext.user.isPupil &&
            certificate.state === 'awaiting-approval' && (
              <>
                <Button
                  type="primary"
                  onClick={() => startSigning(certificate)}
                >
                  Genehmigen
                </Button>
              </>
            )}
          {userContext.user.isPupil && certificate.state === 'manual' && (
            <Tag color="grey">manuell bestätigt</Tag>
          )}
          {userContext.user.isPupil && certificate.state === 'approved' && (
            <Tag color="green">schon bestätigt</Tag>
          )}
        </Space>
      </StyledCard>
    </CardContainer>
  );
}

export default CertificateCard;
