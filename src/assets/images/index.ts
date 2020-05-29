import { ReactComponent as StepsMatched } from './steps_matched.svg';
import { ReactComponent as StepsCheckInformation } from './steps_check_information.svg';
import { ReactComponent as StepsMeetUs } from './steps_meet_us.svg';

const ImageList = {
  StepsMatched,
  StepsCheckInformation,
  StepsMeetUs,
};

const Images: { [I in keyof typeof ImageList]: any } = ImageList;

export default Images;
