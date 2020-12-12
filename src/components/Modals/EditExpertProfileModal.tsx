import React, { useContext, useRef, useState } from 'react';
import DialogModalBase from './DialogModalBase';
import styles from './EditExpertProfileModal.module.scss';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';

const accentColor = '#4E6AE6';

const EditExpertProfileModal = (props) => {
  const [email, setEmail] = useState(null);
  const [expertise, setExpertise] = useState(null);
  const [description, setDescription] = useState(null);
  const [expertiseTags, setExpertiseTags] = useState(null);
  const [visibility, setVisibility] = useState(null);

  const [fieldsMissing, setFieldsMissing] = useState(false);

  const apiContext = useContext(Context.Api);
  const { user } = useContext(Context.User);
  const modalContext = useContext(ModalContext);

  const [Avatar, setAvatar] = useState(props.avatar);

  const avatarUploader = useRef(null);

  function closeModal() {
    modalContext.setOpenedModal(null);
    // can be optional
    [
      setEmail,
      setExpertise,
      setDescription,
      setExpertiseTags,
      setVisibility,
    ].map((method) => typeof method === 'function' && method(null));
  }

  const putExpertProfile = () => {
    if (
      email == null ||
      expertise == null ||
      description == null ||
      expertiseTags == null ||
      visibility == null
    ) {
      setFieldsMissing(true);
      return;
    }
    apiContext
      .updateJufoExpert(user.id, {
        contactEmail: email,
        description,
        expertiseTags: expertiseTags.split(','),
        active: visibility,
      })
      .then(() => closeModal());
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="editExpertProfileModal">
        <DialogModalBase.Header>
          <div className={styles.avatarWrapper}>
            <Avatar className={styles.avatar} />
            <button
              className={styles.avatarOverlay}
              onClick={() => avatarUploader.current.click()}
            >
              <p>Ändern</p>
              <input
                type="file"
                id="file"
                ref={avatarUploader}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const file = e.target.files[0];
                  console.log(file);
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    setAvatar(() => ({ className }) => {
                      return (
                        <img
                          className={className}
                          alt="avatar"
                          src={String(fileReader.result)}
                        />
                      );
                    });
                  };

                  fileReader.readAsDataURL(file);
                }}
              />
            </button>
          </div>
        </DialogModalBase.Header>
        <DialogModalBase.Spacer />
        <DialogModalBase.Header>
          <DialogModalBase.Title>Melanie Meiers</DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
        {fieldsMissing && (
          <DialogModalBase.Error>
            <span>Bitte alle Felder ausfüllen.</span>
          </DialogModalBase.Error>
        )}
        <DialogModalBase.Form>
          <DialogModalBase.InputCompound direction="vertical">
            <DialogModalBase.TextBox
              label="Kontakt E-Mail-Adresse"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <DialogModalBase.TextBox
              label="Fachgebiet"
              onChange={(e) => setExpertise(e.target.value)}
              value={expertise}
            />
            <DialogModalBase.TextArea
              label="Kurzbeschreibung"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <DialogModalBase.TextBox
              label="Experten-Tags"
              onChange={(e) => setExpertiseTags(e.target.value)}
              value={expertiseTags}
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
