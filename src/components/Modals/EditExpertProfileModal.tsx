import React, { useContext, useEffect, useState } from 'react';
import DialogModalBase from './DialogModalBase';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import TagInput from '../forms/TagInput';

const accentColor = '#4E6AE6';
const emailValidationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EditExpertProfileModal = () => {
  const userContext = useContext(Context.User);
  const { user } = userContext;
  const apiContext = useContext(Context.Api);
  const modalContext = useContext(ModalContext);

  const [email, setEmail] = useState(
    user.expertData != null ? user.expertData.contactEmail : ''
  );
  const [description, setDescription] = useState(
    user.expertData != null ? user.expertData.description : ''
  );
  const [expertiseTags, setExpertiseTags] = useState(
    user.expertData != null ? user.expertData.expertiseTags : ['']
  );
  const [visibility, setVisibility] = useState(
    user.expertData != null ? user.expertData.active : null
  );

  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    apiContext.getUsedExpertTags().then((r) => {
      setAvailableTags(r.map((expertTag) => expertTag.name));
    });
  }, []);

  // const [Avatar, setAvatar] = useState(props.avatar);
  //
  // const avatarUploader = useRef(null);

  const resetFields = () => {
    setEmail(user.expertData != null ? user.expertData.contactEmail : '');
    setDescription(user.expertData != null ? user.expertData.description : '');
    setExpertiseTags(
      user.expertData != null ? user.expertData.expertiseTags : ['']
    );
    setVisibility(user.expertData != null ? user.expertData.active : null);
    setFieldsMissing(false);
    setEmailInvalid(false);
  };

  function closeModal() {
    modalContext.setOpenedModal(null);
  }

  useEffect(() => {
    if (modalContext.openedModal === 'editExpertProfileModal') {
      resetFields(); // Re-initialize fields when modal gets opened again (Can't do that in .then() of putExpertProfile because fetchUserData is async and therefore we can't update the modal's fields immediately after re-fetching the new data. Ideally, fetchUserData would return a promise.)
    }
  }, [modalContext.openedModal]);

  const putExpertProfile = () => {
    if (
      email == null ||
      description == null ||
      expertiseTags == null ||
      visibility == null
    ) {
      setFieldsMissing(true);
      return;
    }

    if (!emailValidationRegex.test(String(email).toLowerCase())) {
      setEmailInvalid(true);
      return;
    }
    setEmailInvalid(false);

    apiContext
      .updateJufoExpert(user.id, {
        contactEmail: email,
        description,
        expertiseTags,
        active: visibility,
      })
      .then(() => {
        userContext.fetchUserData();
        closeModal();
      });
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="editExpertProfileModal">
        {/* <DialogModalBase.Header> */}
        {/*  <div className={styles.avatarWrapper}> */}
        {/*    <Avatar className={styles.avatar} /> */}
        {/*    <button */}
        {/*      className={styles.avatarOverlay} */}
        {/*      onClick={() => avatarUploader.current.click()} */}
        {/*    > */}
        {/*      <p>Ändern</p> */}
        {/*      <input */}
        {/*        type="file" */}
        {/*        id="file" */}
        {/*        ref={avatarUploader} */}
        {/*        accept="image/*" */}
        {/*        style={{ display: 'none' }} */}
        {/*        onChange={(e) => { */}
        {/*          e.stopPropagation(); */}
        {/*          e.preventDefault(); */}
        {/*          const file = e.target.files[0]; */}
        {/*          console.log(file); */}
        {/*          const fileReader = new FileReader(); */}
        {/*          fileReader.onload = () => { */}
        {/*            setAvatar(() => ({ className }) => { */}
        {/*              return ( */}
        {/*                <img */}
        {/*                  className={className} */}
        {/*                  alt="avatar" */}
        {/*                  src={String(fileReader.result)} */}
        {/*                /> */}
        {/*              ); */}
        {/*            }); */}
        {/*          }; */}

        {/*          fileReader.readAsDataURL(file); */}
        {/*        }} */}
        {/*      /> */}
        {/*    </button> */}
        {/*  </div> */}
        {/* </DialogModalBase.Header> */}
        <DialogModalBase.Spacer />
        <DialogModalBase.Header>
          <DialogModalBase.Title>{`${user.firstname} ${user.lastname}`}</DialogModalBase.Title>
          <DialogModalBase.CloseButton hook={resetFields} />
        </DialogModalBase.Header>
        {fieldsMissing && (
          <DialogModalBase.Error>
            <span>Bitte fülle alle Felder aus.</span>
          </DialogModalBase.Error>
        )}
        {emailInvalid && (
          <DialogModalBase.Error>
            <span>Die eingegebene E-Mail-Adresse ist ungültig.</span>
          </DialogModalBase.Error>
        )}
        <DialogModalBase.Form>
          <DialogModalBase.InputCompound direction="vertical">
            <DialogModalBase.TextBox
              label="Kontakt E-Mail-Adresse"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <DialogModalBase.TextArea
              label="Kurzbeschreibung"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <TagInput
              accentColor={accentColor}
              onChange={(newTags) => setExpertiseTags(newTags)}
              value={expertiseTags}
              title="Experten-Tags"
              availableTags={availableTags}
            />
          </DialogModalBase.InputCompound>
          <DialogModalBase.Spacer />
          <DialogModalBase.Label>
            Möchtest du als Experte*in vorgeschlagen werden?
          </DialogModalBase.Label>
          <DialogModalBase.InputCompound direction="horizontal">
            <DialogModalBase.CheckboxSingle
              label="Ja"
              value
              selected={visibility}
              onSelect={setVisibility}
            />
            <DialogModalBase.CheckboxSingle
              label="Nein"
              value={false}
              selected={visibility}
              onSelect={setVisibility}
            />
          </DialogModalBase.InputCompound>
          <DialogModalBase.Spacer />

          <DialogModalBase.ButtonBox>
            <DialogModalBase.Button
              label="Speichern"
              onClick={putExpertProfile}
            />
          </DialogModalBase.ButtonBox>
        </DialogModalBase.Form>
        <DialogModalBase.Spacer />
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default EditExpertProfileModal;
