import React from "react";
import {ParsedCourseOverview} from "../../types/Course";
import {firstLectureOfSubcourse} from "../../utils/CourseUtil";
import moment from "moment";
import classes from "./MiniCourseCard.module.scss";
import Icons from "../../assets/icons";
import { useHistory } from "react-router-dom";

export const MiniCourseCard = (course: ParsedCourseOverview) => {
  const firstLecture = firstLectureOfSubcourse(course.subcourse);
  const firstLectureDate = moment.unix(firstLecture.start).format("DD.MM.");

  const history = useHistory();

  return (
    <div className={classes.courseCard} onClick={() => history.push(`/courses/${course.id}`)}>
      <div className={classes.highlight} />
      <div className={classes.courseTitle}>
        { course.name }
      </div>
      <div className={classes.courseOutline}>
        { course.outline }
      </div>

      <div className={classes.courseInformation}>
        <div className={classes.courseDate}>
          <Icons.Grade style={{width: "25px", height: "25px"}} />
          <div className={classes.courseDateText}>
            { course.subcourse?.lectures.length > 1 ? `ab ${firstLectureDate}` : firstLectureDate }
          </div>
        </div>
        <div className={classes.grade}>
          <Icons.Grade style={{width: "25px", height: "25px"}} />
          <div className={classes.gradeText}>
            {course.subcourse.minGrade}. - {course.subcourse.maxGrade}. Klasse
          </div>
        </div>
      </div>
    </div>
  )
}
