import React, { useContext } from 'react';
import StyledReactModal from 'styled-react-modal';
import Button from '../button';
import Images from '../../assets/images';
//import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
//import CertificateModal from '../Modals/CerificateModal';
import styled from 'styled-components';

//import { Tag } from '../Tag';
import context from '../../context';

import classes from './MentoringCard.module.scss';
//import BecomeInstructorModal from '../Modals/BecomeInstructorModal';
//import BecomeInternModal from '../Modals/BecomeInternModal';
import { Checkbox, Dropdown } from 'antd';
import { User } from '../../types';

const SelectStyle = styled.select`
  width: 310px;
  height: 28px;
  padding: 2px 5px;
  border: 1px solid ${(props) => props.theme.colorScheme.gray1};
  box-sizing: border-box;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.333333px;
  color: border-color: rgb(244, 72, 109);
  border-color: rgb(244, 72, 109)
`;



const SelectWrapper = styled.div`
   align-items: center; 
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;
`;


interface Props {
  user: User;
}

const MentoringCard: React.FC<Props> = ({ user }) => {
  //const modalContext = useContext(context.Modal);
 // const ApiContext = useContext(context.Api);

 /* const renderCourseButton = () => {
    if (user.type !== 'student') {
      return;
    }

    if (user.isInstructor) {
      return;
    }

    
  };*/

  const handleOnChangeCategory = (value: number): void => {
    if (value === 1){
      console.log("1");
    } else if(value === 2){
        console.log("2");
    } else if(value === 3){

    } else if(value === 4){

    } else{
      
    }

  };
  

  return (
    <>
      <CardBase highlightColor="#F4486D"   className={classes.baseContainer}>
        <div className={classes.container}>
          <div>
          <Title size="h4" bold>
              Du hast Fragen?
            </Title>
           
            
            <SelectWrapper>
            <Text large > Kategorie: </Text>
            <SelectStyle
                  
                  onChange={(e) =>
                    handleOnChangeCategory(Number(e.target.value))
                  }
                >
                  <option value="1" > Sprachschwierigkeiten und Kommunikation</option>
                  <option value="2"> Inhaltliche Kompetenzen in bestimmten Unterrichtsfächern</option>
                  <option value="3">Pädagogische und didaktische Hilfestellungen</option>
                  <option value="4">Organisatorisches und Selbststrukturierung</option>
                  <option value="5">Sonstiges</option>
                </SelectStyle>
             
              
                   <Images.MentoringPic width="120px" height="120px" marginLeft='auto' padding="5px"/>
              
                </SelectWrapper>
          </div>
         
          <div >
           <textarea id="questionsMentoring" required className = {classes.inputfield} />
          </div>
          </div>
            <Checkbox className={classes.checkbox}> Agreement</Checkbox>
            <Button className={classes.buttonSend}>Abschicken</Button>
         
        
      </CardBase>
    </>
  );
};

export default MentoringCard;
