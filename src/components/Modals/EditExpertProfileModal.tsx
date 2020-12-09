import React, { useState } from 'react';
import DialogModalBase from './DialogModalBase';
import styles from './EditExpertProfileModal.module.scss';

const accentColor = '#D03D53';

const EditExpertProfileModal = () => {
  const [email, setEmail] = useState(null);
  const [expertise, setExpertise] = useState(null);
  const [description, setDescription] = useState(null);
  const [expertiseTags, setExpertiseTags] = useState(null);
  const [visibility, setVisibility] = useState(null);

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="editExpertProfileModal">
        <DialogModalBase.Header>
          <div className={styles.avatarWrapper}>
            <img
              className={styles.avatar}
              alt="avatar"
              src="https://www.lensmen.ie/wp-content/uploads/2015/02/Profile-Portrait-Photographer-in-Dublin-Ireland.-1030x1030.jpg"
            />
            <div className={styles.avatarOverlay}>
              <p>Ändern</p>
            </div>
          </div>
        </DialogModalBase.Header>
        <DialogModalBase.Spacer />
        <DialogModalBase.Header>
          <DialogModalBase.Title>Melanie Meiers</DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
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
              onClick={() => alert('fertig')}
            />
          </DialogModalBase.ButtonBox>
        </DialogModalBase.Form>
        <DialogModalBase.Spacer />
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default EditExpertProfileModal;
