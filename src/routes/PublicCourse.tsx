import React, {useContext, useEffect, useState} from "react";
import CourseOverview from "../components/CourseOverview";
import classes from "./PublicCourse.module.scss";
import Icons from "../assets/icons";
import {Title} from "../components/Typography";
import {ParsedCourseOverview} from "../types/Course";
import Context from "../context";
import {defaultPublicCourseSort, parseCourse} from "../utils/CourseUtil";

const PublicCourse = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);

  const apiContext = useContext(Context.Api);

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

  const Header = () => {
    return (
      <div className={classes.header}>
        <div className={classes.logo}>
          <Icons.Logo />
          <Title className={classes.logoText} >
            Corona School
          </Title>
        </div>
        <div className={classes.weVsVirusLogo} >
          <Icons.WirVsVirusLogo  />
        </div>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.main}>
        { CourseOverview(courses) }
      </div>
    </div>
  )
}

export default PublicCourse;
