import React, {useContext, useEffect, useState} from "react";
import { Radio } from "antd";
import {Text} from "./Typography";

import {CourseCategory, ParsedCourseOverview} from "../types/Course";
import classes from "./CourseOverview.module.scss";
import Icons from "../assets/icons/index";
import {CourseIntroductionText} from "../assets/courseIntroduction";
import {tags} from "./forms/CreateCourse";
import {
  defaultPublicCourseSort,
  firstLectureOfSubcourse,
  parseCourse
} from "../utils/CourseUtil";
import Context from "../context";
import moment from "moment";
import { useHistory } from "react-router-dom";


const CourseOverview = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);

  const [courseCategory, setCourseCategory] = useState(CourseCategory.CLUB);

  const apiContext = useContext(Context.Api);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((c) => {
        setCourses(c.map(parseCourse).sort(defaultPublicCourseSort));
      })
      .catch((e) => {
        // message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext]);

  const CategoryButtons = () => {
    return (
      <Radio.Group defaultValue={courseCategory} onChange={e => setCourseCategory(e.target.value)} className={classes.radio} buttonStyle="solid">
        <Radio.Button value={CourseCategory.CLUB} className={classes.button}>
            Sommer-AGs
        </Radio.Button>
        <Radio.Button value={CourseCategory.REVISION} className={classes.button}>
            Repetitorium
        </Radio.Button>
        <Radio.Button value={CourseCategory.COACHING} className={classes.button}>
          Lerncoaching
        </Radio.Button>
      </Radio.Group>
    )
  }

  const OverviewHeader = () => {
    return (
      <div className={classes.header}>
        <CategoryButtons />
        <Text className={classes.headerText}>
          { CourseIntroductionText }
        </Text>
      </div>
    )
  }

  const CourseCard = (course: ParsedCourseOverview) => {
    const firstLecture = firstLectureOfSubcourse(course.subcourse);
    const firstLectureDate = moment(firstLecture.start).format("DD.MM.");

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

  const CoursesWithTag = (tag: string) => {
    const tagDisplay =
      <Text className={classes.tagDisplay}>
        { tag }
      </Text>

    const scrollFrame =
      <div className={classes.scrollFrame}>
        { courses
          .filter(c => c.tags.find(t => t.name === tag))
          .map(c => CourseCard(c))
        }
      </div>

    return (
      <div className={classes.coursesWithTag}>
        { tagDisplay }
        { scrollFrame }
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <OverviewHeader />
      <div className={classes.main}>
        { tags.get(courseCategory).map(t => CoursesWithTag(t.name)) }
      </div>
    </div>

  )
}

export default CourseOverview;
