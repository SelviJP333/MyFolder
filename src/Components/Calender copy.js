import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

function Calender(props) {
 
    let disabledDaysIndexes = [1, 2, 3, 4, 5, 6];
    let initDate = new Date();
  
    const getSelectedDayEvents = (date) => {
      let markedDates = {};
  
      markedDates[date] = {
        selected: true,
        color: "#00B0BF",
        textColor: "#FFFFFF",
        disabled: false,
      };
      
      setMarkedDates(markedDates);
  
      let pivot = moment()
        .month(initDate.getMonth())
        .year(initDate.getFullYear())
        .startOf("month");
      const end = moment()
        .month(initDate.getMonth())
        .year(initDate.getFullYear())
        .endOf("month");
      const disabled = { disabled: true, disableTouchEvent: true };
      while (pivot.isBefore(end)) {
        disabledDaysIndexes.forEach((day) => {
          const copy = moment(pivot);
          markedDates[copy.day(day).format("YYYY-MM-DD")] = disabled;
          markedDates[moment(new Date()).format("YYYY-MM-DD")] = {
            selected: false,
            marked: false,
            selectedColor: "transparent",
          };
        });
        pivot.add(7, "days");
      }
      props.date(moment(date).format("DD-MM-YYYY"))
      //setDate(moment(date).format("DD-MM-YYYY"));
    };
   
    const [markedDates, setMarkedDates] = useState({});
    useEffect(() => {
      getDisabledDays(
        initDate.getMonth(),
        initDate.getFullYear(),
        disabledDaysIndexes
      );
    }, []);
    const getDisabledDays = (month, year, daysIndexes) => {
      let pivot = moment().month(month).year(year).startOf("month");
      const end = moment().month(month).year(year).endOf("month");
      let dates = {};
      const disabled = { disabled: true, disableTouchEvent: true };
      while (pivot.isBefore(end)) {
        daysIndexes.forEach((day) => {
          const copy = moment(pivot);
          dates[copy.day(day).format("YYYY-MM-DD")] = disabled;
          dates[moment(new Date()).format("YYYY-MM-DD")] = {
            selected: false,
            marked: false,
            selectedColor: "transparent",
          };
        });
        pivot.add(7, "days");
      }
  
      setMarkedDates(dates);
  
      return dates;
    };
    return (
        <Calendar 
        theme={{
          textSectionTitleDisabledColor: "#d9e1e8",
        }}
        markedDates={markedDates} 
        onDayPress={(day) => {
          getSelectedDayEvents(day.dateString);
        }}
        hideArrows={true}
        firstDay={1}
        enableSwipeMonths={false}
        disabledDaysIndexes={disabledDaysIndexes}
        // onMonthChange={(date) => {
        //   getDisabledDays(date.month - 1, date.year, disabledDaysIndexes);
        // }}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          height: 350,
          width:500
        }}
        // Specify theme properties to override specific styles for calendar parts. Default = {}
     
      />
    );
}

export default Calender;