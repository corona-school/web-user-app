import { ReactComponent as StepsMatched } from './steps_matched.svg';
import { ReactComponent as StepsCheckInformation } from './steps_check_information.svg';
import { ReactComponent as StepsMeetUs } from './steps_meet_us.svg';
import { ReactComponent as StepsFeedback } from './steps_feedback.svg';
import { ReactComponent as StepsLearnTogether } from './steps_learn_together.svg';
import { ReactComponent as StepsReadMore } from './steps_read_more.svg';
import { ReactComponent as StepsRequest } from './steps_request.svg';
import { ReactComponent as StepsContact } from './steps_contact.svg';
import { ReactComponent as LetUsMeetIllustration } from './letUsMeetIllustration.svg';

const ImageList = {
  StepsMatched,
  StepsCheckInformation,
  StepsMeetUs,
  StepsFeedback,
  StepsLearnTogether,
  StepsReadMore,
  StepsRequest,
  StepsContact,
  LetUsMeetIllustration,
};

const Images: { [I in keyof typeof ImageList]: any } = ImageList;

export default Images;
