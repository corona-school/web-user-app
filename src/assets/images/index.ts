import { ReactComponent as StepsMatched } from './steps_matched.svg';
import { ReactComponent as StepsCheckInformation } from './steps_check_information.svg';
import { ReactComponent as StepsMeetUs } from './steps_meet_us.svg';
import { ReactComponent as StepsFeedback } from './steps_feedback.svg';
import { ReactComponent as StepsLearnTogether } from './steps_learn_together.svg';
import { ReactComponent as StepsReadMore } from './steps_read_more.svg';
import { ReactComponent as StepsRequest } from './steps_request.svg';
import { ReactComponent as StepsContact } from './steps_contact.svg';
import { ReactComponent as LetUsMeetIllustration } from './letUsMeetIllustration.svg';
import { ReactComponent as TrashIllustration } from './trash.svg';

import { ReactComponent as SignupBackground1 } from './signup/background-bottom-right.svg';
import { ReactComponent as SignupBackground2 } from './signup/background-top-left.svg';
import { ReactComponent as SignupBackgroundCircle1 } from './signup/bright-yellow-circle.svg';
import { ReactComponent as SignupBackgroundCircle2 } from './signup/yellow-circle.svg';
import { ReactComponent as SignupBackgroundZickZack } from './signup/zick-zack-line.svg';
import { ReactComponent as MentoringPic } from './mentoring.svg';

import { ReactComponent as Celebration } from './celebration_blue.svg';

import DrehtuerDefaultCourseCover from './drehtuer.png';

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
  SignupBackground1,
  SignupBackground2,
  SignupBackgroundCircle1,
  SignupBackgroundCircle2,
  SignupBackgroundZickZack,
  Celebration,
  MentoringPic,
  TrashIllustration,
  DrehtuerDefaultCourseCover,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Images: { [I in keyof typeof ImageList]: any } = ImageList;

export default Images;
