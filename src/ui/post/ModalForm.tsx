import React, { useState } from 'react';
import styled from 'styled-components';
import { FormikProvider, FormikProps } from 'formik';

import Avatar from '../common/Avatar';
import Button from '../common/Button';
import FormikInput from '../form/FormikInput';

import { useS3Image } from '../../hooks';

import MediaButton from './MediaButton';
import ModalPreviewMedias from './ModalPreviewMedias';

const Container = styled.form`
  section {
    display: flex;
    flex-direction: row;

    img {
      margin-right: 15px;
    }
  }

  div {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 700px) {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0 60px;
  }
`;

const Input = styled(FormikInput)<{ withMedia: boolean }>`
  background: none;
  padding: 0;
  margin: ${props => (props.withMedia ? '10px 0 0' : '10px 0 50px')};

  flex: 1;

  @media (max-width: 550px) {
    textarea {
      font-size: 18px;
    }
  }
`;

const SubmitButton = styled(Button)`
  color: #fff;
  margin-left: 10px;
  font-size: 18px;
  font-weight: 900;
  flex: 1;
`;

interface Props {
  formik: FormikProps<any>;
  hash: string;
}

const ModalForm: React.FC<Props> = ({ formik, hash }) => {
  const [files, setFiles] = useState([]);
  const avatar = useS3Image(hash, 'thumbSmall');

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Container onSubmit={handleSubmit}>
        <section>
          <Avatar src={avatar as string} alt="avatar" size="small" />
          <Input withMedia={files.length > 0} multiline name="content" placeholder="Post something awesome!" dark />
        </section>

        <ModalPreviewMedias files={files} setFiles={setFiles} />

        <div>
          <MediaButton name="imagehashes" setFiles={setFiles} files={files}>
            Photo/Video
          </MediaButton>
          <SubmitButton background="green" radius="rounded" color="#fff" type="submit" disabled={!formik.isValid}>
            Post
          </SubmitButton>
        </div>
      </Container>
    </FormikProvider>
  );
};

export default ModalForm;
