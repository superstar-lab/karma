import React from 'react';
import styled, { css } from 'styled-components';
import { FormikProvider, FormikProps } from 'formik';

import ModalWrapper, { ModalProps } from '../common/ModalWrapper';
import ImageInput from '../form/ImageInput';
import FormikInput from '../form/FormikInput';
import Button from '../common/Button';
import Space from '../common/Space';
import Row from '../common/Row';
import Title from '../common/Title';

export const Container = styled.form`
  width: 100%;
  max-width: 700px;
  background: ${props => props.theme.dark};
  padding: 30px 50px;
  border-radius: 20px;

  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    height: 100vh;
    padding: 50px 15px;
    border-radius: 0;
  }
`;

const SubmitButton = styled(Button)`
  height: 55px;
  font-size: 24px;
  font-weight: 900;

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface InputProps {
  flex?: boolean;
}
const Input = styled(FormikInput)<InputProps>`
  @media (max-width: 700px) {
    padding: 10px 14px;

    header > span {
      font-size: 13px;
    }

    input,
    textarea {
      font-size: 18px;
    }
  }

  ${props =>
    props.flex &&
    css`
      width: calc(100% - (82px + 30px));

      @media (max-width: 700px) {
        width: calc(100% - (82px + 20px));
      }
    `}
`;

interface Props extends ModalProps {
  formik: FormikProps<any>;
  title?: string;
  customHeader?: React.FC;
}

const ProfileModal: React.FC<Props> = ({ title, customHeader: CustomHeader, formik, ...props }) => {
  const { handleSubmit, isValid } = formik;

  return (
    <ModalWrapper {...props}>
      <FormikProvider value={formik}>
        <Container onSubmit={handleSubmit}>
          {CustomHeader ? (
            <CustomHeader />
          ) : (
            <Title bordered={false} size="small">
              {title}
            </Title>
          )}
          <Space height={35} />

          <Row>
            <ImageInput name="avatar" />
            <Input label="Name" name="name" placeholder="Enter Name" required bordered flex />
          </Row>

          <Space height={25} />

          <Input label="Username" name="username" required bordered mask="@" />
          <Space height={25} />

          <Input
            label="Bio"
            name="bio"
            placeholder={`Tell everyone why you’re awesome\nTip: use emoji’s`}
            multiline
            bordered
          />
          <Space height={25} />

          <Input label="Website" name="website" mask="https://www." bordered />
          <Space height={25} />

          <SubmitButton type="submit" background="green" radius="rounded" disabled={!isValid}>
            Save
          </SubmitButton>
        </Container>
      </FormikProvider>
    </ModalWrapper>
  );
};

export default ProfileModal;
