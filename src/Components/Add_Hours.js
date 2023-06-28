export const Total = (ff, type) => {
  let Total_Dbl = 0;
  let Total_Ot = 0;
  let Total_Reg = 0;
  if (type === 'reg') {
    Total_Reg =
      ff['MonRegularHours'] +
      ff['TueRegularHours'] +
      ff['WedRegularHours'] +
      ff['ThuRegularHours'] +
      ff['FriRegularHours'] +
      ff['SatRegularHours'] +
      ff['SunRegularHours'];

    return Total_Reg;
  } else if (type === 'ot') {
    Total_Ot =
      ff['MonOvertimeHours'] +
      ff['TueOvertimeHours'] +
      ff['WedOvertimeHours'] +
      ff['ThuOvertimeHours'] +
      ff['FriOvertimeHours'] +
      ff['SatOvertimeHours'] +
      ff['SunOvertimeHours'];
    
    return Total_Ot;
  } else if (type === 'dbl') {
    Total_Dbl =
      ff['MonDoubleTimeHours'] +
      ff['TueDoubleTimeHours'] +
      ff['WedDoubleTimeHours'] +
      ff['ThuDoubleTimeHours'] +
      ff['FriDoubleTimeHours'] +
      ff['SatDoubleTimeHours'] +
      ff['SunDoubleTimeHours'];
    return Total_Dbl;
  }
};
