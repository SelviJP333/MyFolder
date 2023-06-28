import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"; 
import {
  Cell,
  Row,
  Rows,
  Table,
  TableWrapper,
} from "react-native-table-component";
import Delete_Company_Pop from "../Components/Delete_Comapany_pop";
import Delete_Job_Pop from "../Components/Delete_Job_pop";
import Delete_Phase_Pop from "../Components/Delete_Phase_pop";
import Scroll_modal from "../DrawerScreens/scroll_modal";
import Add from "../Image/icon-plus.png";
import Remove from "../Image/icon-remove.png";
import Copy from "../Image/icon-timecopy.png";
import Processing from "../Components/Processing";
import AddCompany from "./AddCompany";
import AddJob from "./AddJob";
import AddPhase from "./AddPhase";
import AddEmployee from "./AddEmployee";
import { useSelector, useDispatch } from "react-redux";
import { AddData } from "../redux/actions/Action";
import { RemoveData } from "../redux/actions/Action";
import { change } from "../redux/actions/Action";
import { applyMiddleware } from "redux";
import Timesheet_popup from '../Components/timesheet_popup'
import db from "../Components/db";

 
const CopyTimeSheetScreen = ({ route, navigation }) => {
  const [selectedJob, SetSelectedJob] = useState("");
  const [SelectedPhase, SetSelectedPhase] = useState([]);
  const [modalComapanyVisible, setmodalComapanyVisible] = useState(false);
  const [modalEmployeeVisible, setmodalEmployeeVisible] = useState(false);
  const [modalJobVisible, setmodalJobVisible] = useState(false);
  const [modalPhaseVisible, setmodalPhaseVisible] = useState(false); 
  const [job_index, setjob_index] = useState(null);
  const [company_index, setcompany_index] = useState(null);
  const [phasejob_index, setphasejob_index] = useState(null);
  const [data, setData] = useState(null);
  const [selectedphasename, setselectedphasename] = useState(null);
  const [selectedcompanyname, setselectedcompanyname] = useState(null);
  const [alreadyExist, setalreadyExist] = useState([]);
  const [Employee, setEmployee] = useState([]);
  const [deletejob_modal, setdeletejob_modal] = useState(false);
  const [deleteComapany_modal, setdeleteCompany_modal] = useState(false);
  const [deleteEmployee_modal, setdeleteEmployee_modal] = useState(false);
  const [Usernamelist, setUsernamelist] = useState([]);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [deletePhase_modal, setdeletePhase_modal] = useState(false);
  const [selected_data, setselected_data] = useState([]);
  const [hoursmodalVisible, sethoursmodalVisible] = useState(false);
  const [indexvalue, setindexvalue] = useState(0);
  const [empty, setempty] = useState([]);
  const [process_loader, setprocess_loader] = useState(false)
  const [popup_twentyfour, setpopup_twentyfour] = useState(false)
  const [popup_entry, setpopup_entry] = useState(false)
  const dispatch = useDispatch();
  const weekdate = [
    "10/17",
    "10/18",
    "10/19",
    "10/20",
    "10/21",
    "10/22",
    "10/23",
  ];
  const [times, settimes] = useState({
    RegularTime: 0,
    Overtime: 0,
    DBL: 0,
  });

  const [totalgroup1, settotalgroup1] = useState({
    reg1: 0,
    ovt1: 0,
    dbl1: 0,
  });

  const [totalgroup2, settotalgroup2] = useState({
    reg2: 0,
    ovt2: 0,
    dbl2: 0,
  });

  const [totalgroup3, settotalgroup3] = useState({
    reg3: 0,
    ovt3: 0,
    dbl3: 0,
  });
  const [totalgroup4, settotalgroup4] = useState({
    reg4: 0,
    ovt4: 0,
    dbl4: 0,
  });
  const [totalgroup5, settotalgroup5] = useState({
    reg5: 0,
    ovt5: 0,
    dbl5: 0,
  });
  const [totalgroup6, settotalgroup6] = useState({
    reg6: 0,
    ovt6: 0,
    dbl6: 0,
  });
  const [totalgroup7, settotalgroup7] = useState({
    reg7: 0,
    ovt7: 0,
    dbl7: 0,
  });
  const [totalgroup8, settotalgroup8] = useState({
    reg8: 0,
    ovt8: 0,
    dbl8: 0,
  });
 
  const [total_RegularTime, settotal_RegularTime] = useState(0);
  const [total_Overtime, settotal_Overtime] = useState(0);
  const [total_DBL, settotal_DBL] = useState(0);

  let [Company, SetCompany] = useState([]);
  let [CompanyID, SetCompanyID] = useState([]);
  let [Jobs, setJobs] = useState([]);
  let [JobID, SetJobID] = useState([]);
  let [Phase, setPhase] = useState([]);
  let [AllCompany, SetAllCompany] = useState([]);
  let [AllJobs, setAllJobs] = useState([]);
  let [AllPhase, setAllPhase] = useState([]);
  const [Pageloading, setPageLoading] = useState(false);
  const [Jobloading, setJobLoading] = useState(false);
  const [Companyloading, setCompanyLoading] = useState(false);
  const [Phaseloading, setPhaseLoading] = useState(false);
  const [Employeeloading, setEmployeeloading] = useState(false);
  const [TableData, setTableData] = useState([]);

  const getUser = useSelector((store) => store);
  
  // Get Company list
  const GetCompany = () => {
    SetSelectedJob("");

    db.transaction((tx) => {
      setCompanyLoading(true);
      tx.executeSql("SELECT * FROM lkpcompany", [], (tx, res) => {
        var temp = [];

        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        let newArray = temp.map((item) => {
          return {
            key: "" + item.CompanyID + "$$$" + item.CompanyName + "",
            value: "" + item.CompanyID + " - " + item.CompanyName + "",
            status: false,
            check: false,
            ID: item.CompanyID,
          };
        });
        const data = newArray.filter((i) => i.check == false);
        if (route.params.paramKeyEmployee!=undefined) {
          let resultparam = route.params.paramKeyEmployee.map((item => item.key))
          setUsernamelist(resultparam)
         
        }
if(route.params&&route.params.paramKeyCompany!=undefined){
   // company push
   let result = [];
   // pushing
   route.params&& route.params.paramKeyCompany.filter(((item)=>item.Username==route.params.paramKeyEmployee.map((item => item.key))[indexvalue])).reduce((accumulator, currentValue) => {

     const check = (CompanyName) => {

       accumulator.forEach(e => {
         if (e[0][0] === CompanyName) { 
           return true
         } else {
           return false
         }
       })
     }


     if (accumulator.length === 0) {

       accumulator.push([[currentValue.CompanyName]])
       //  acc=[['99-Test Company #99'],['99-Test Company #99']]
     } else if (!accumulator.flat(3).includes(currentValue.CompanyName)) {

       accumulator.push([[currentValue.CompanyName]])
     }
     return accumulator

   },
     result
   );

   // job push
   let result2 = result.map(e => {  
     let job_push = []

     //   job_push=[[],[]]
     if (route.params&&route.params.paramKeyCompany.filter(job => e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&job.Username==route.params.paramKeyEmployee.map((item => item.key))[indexvalue]).length != 0) {

       let s =route.params&& route.params.paramKeyCompany.filter(job => e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&job.Username==route.params.paramKeyEmployee.map((item => item.key))[indexvalue]) 
       s.forEach((ee, i) => {
        
         if (!job_push.flat().includes(ee.JobName)) { 
           if (ee.JobName !== null) {
          //  ee.JobName =Object.values(ee.JobName)+"+"+ TimesheetID 
             job_push.push([ee.JobName])
           } else {
             // job_push=null
           }

         }

       })

       return job_push.length === 0 ? [[e[0][0]]] : [[e[0][0]], job_push]
     }

     return [[e[0][0]]]

   })


   // phase push
   let result3 = result2.map(e => {
 
     if (e[1]) {
       let modified = e[1].map(ee => { 

         let phase_push = []


         if (ee[0]) {

           if (route.params&&route.params.paramKeyCompany.filter(job => ee[0] === job.JobName
             &&job.Username==route.params.paramKeyEmployee.map((item => item.key))[indexvalue]).length != 0) {
             let phasefil =route.params&& route.params.paramKeyCompany.filter(job => ee[0] === job.JobName && job.Username==route.params.paramKeyEmployee.map((item => item.key))[indexvalue]);

             phasefil.forEach(item => {

               if (item.PhaseCodeName !== null) {
                phase_push.push([item.PhaseCodeName,
                  `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
                  `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
                  `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
                  `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
                  `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
                  `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
                  `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
                  `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`])
               }


             })


             return phase_push.length === 0 ? [ee[0]] : [ee[0], phase_push]

           }
         }

         return ee
       })
     
       return [[e[0][0]], modified]
     }

     return e
   })


   setTableData(result3)
}
        SetAllCompany(data);
        SetCompany(data);
        setTimeout(() => {
          setCompanyLoading(false);
        }, 2000);
      });
    });
  };

  // Get Employee list
  const GetEmployee = async () => {
    let Userid = await AsyncStorage.getItem("Userid");
    db.transaction((tx) => {
      setEmployeeloading(true);
      tx.executeSql(`SELECT * FROM User`, [], async (tx, res) => {
        var temp = [];

        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }

        let newArray = temp.map((item) => {
          return {
            key: item.Username,
            value: item.EmployeeID,
            status: false,
            check: false,
          };
        });

        const data = newArray.filter(
          (i) => i.check == false && i.value != Userid
        );

        setEmployee(data);

        setTimeout(() => {
          setEmployeeloading(false);
        }, 1000);
      });
    });
  };
 

  useEffect(() => {
    
    GetCompany();
    GetEmployee();
    // getData();
  }, []);

  // Get JOblist

  const GetJobs = (selectedCompany, company_index = null) => {
    //SetSelectedPhase("");

    setJobLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "select JobID,JobName,JobNo from LkpJob where CompanyID = ?",

        [selectedCompany],

        (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map((item) => {
            return {
              key: "" + item.JobID + "$$$" + item.JobName + "$$$" + item.JobNo,

              value: item.JobID + "-" + item.JobNo + " - " + item.JobName + "",

              check: false,
              ID: item.JobID,
              status: false,
            };
          });

          const data = newArray.filter((i) => i.check == false);

          let check_already;
          let removed_id = [];
          if (TableData[company_index][1]) {
            TableData[company_index][1].forEach((e) => {
              removed_id.push(e[0].split("+")[0].trim());
            });
          }

          check_already = data.map((e, i) => {
            if (removed_id && removed_id.includes(e.value)) {
              return {
                ...e,
                check: true,
                status: true,
              };
            } else {
              return { ...e };
            }
          });

          setAllJobs(data);
          setTimeout(() => {
            setJobLoading(false);
          }, 1000);
          setJobs(check_already);
        }
      );
    });
  };

  // get phase list
  const GetPhase = (SetSelectedJob) => {
    setPhaseLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "select PhaseCodeID,PhaseCode,PhaseCodeName from LkpPhaseCode where JobID = ?",

        [SetSelectedJob],

        (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map((item) => {
            return {
              key: "" + item.PhaseCode + "$$$" + item.PhaseCodeName + "",

              value: item.PhaseCodeID + "-" + item.PhaseCodeName,

              check: false,

              status: false,
            };
          });

          let removed_id = [];

          TableData[company_index] && TableData[company_index][1] &&
            TableData[company_index][1][phasejob_index] &&
            TableData[company_index][1][phasejob_index][1] &&
            TableData[company_index][1][phasejob_index][1].forEach((e) => {
              removed_id.push(e[0].split("+")[0].trim());
            });

          let check_already;

          check_already = newArray.map((e, i) => {
            if (removed_id !== 0) {
              if (removed_id.includes(e.value)) {
                return {
                  ...e,
                  check: true,
                  status: true,
                };
              } else {
                return { ...e };
              }
            } else {
              return { ...e };
            }
          });

          const data = newArray.filter((i) => i.check == false);

          setPhase(check_already);
          setPhaseLoading(false);
          setAllPhase(data);
        }
      );
    });
  };

  // company modal visible
  const alertCompany = () => {
    //setTableData(userEmail)

    setmodalComapanyVisible(true);
  };
  // employee modal visible
  const alertEmployee = () => {
    setmodalEmployeeVisible(true);
  };

  // companyjobvisible
  const alertJob = (e, job_i) => {
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete job popup open and do functionality respectively
  const deletejob = (e, job_i, company_index) => {
    setcompany_index(company_index);
    setdeletejob_modal(true);
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete company popup open and do functionality respectively
  const deleteCompany = (e, company_index) => {
    setcompany_index(company_index);
    setdeleteCompany_modal(true);
    setmodalComapanyVisible(true);
    setselectedcompanyname(e);
  };

  // delete phase popup open and do functionality respectively
  const deletePhase = (e, phase_i, job_i, company_i) => {
    setcompany_index(company_i);
    setjob_index(job_i), setphasejob_index(phase_i);
    setmodalPhaseVisible(true);
    setdeletePhase_modal(true);
    setselectedphasename(e);
  };

  //get company index and job index to add phase
  const alertPhase = (e, company_i, job_i) => {
    setphasejob_index(job_i);

    setcompany_index(company_i);

    setmodalPhaseVisible(true);
  };
  const AddEmployeeName = (selectEmployee, selectEmployeeID) => {
    if (modalEmployeeVisible === true && deleteEmployee_modal !== true) {
      setmodalEmployeeVisible(false);

      setUsernamelist((prev) => [...prev, ...selectEmployee]);
      setEmployeeID((prev) => [...prev, ...selectEmployeeID]);
      let modified = Employee.map((e) => {
        if (e.check === true) {
          return { ...e, status: true };
        }

        return { ...e };
      });

      setEmployee(modified);
    }
  };

  // This function related to add and delete company,job,phase row in table respectively
  const handleAddRow = (
    SelectedPhase1,
    SelectedPhasename1,
    SelectedJobname1,
    selectetJobID,
    SelectedJobCode1,
    selectedCompany,
    selectedCompanyID
  ) => {
    if (modalComapanyVisible === true && deleteComapany_modal !== true) {
      // Add only company
      if (selectedCompany.length === 0) {
        Alert.alert("Please Select Company");
        return;
      }

      selectedCompany.forEach((e, i) => {
        var companyguid = generateGuidQuickly();
        setTableData((prev) => [...prev, [[`${e}+${companyguid}`]]]);
      });

      CompanyID.push(selectedCompanyID[0]);

      setmodalComapanyVisible(false);
      let modified = Company.map((e) => {
        if (e.check === true) {
          return { ...e, status: true };
        }

        return { ...e };
      });

      SetCompany(modified);
    } else if (modalJobVisible === true && deletejob_modal !== true) {
      //Add Job only
      let empty = [];
      const add = (id) => {
        SelectedJobname1.forEach((job_e, i) => {
          var jobguid = generateGuidQuickly();
          empty.push([`${job_e} +${id}+${jobguid}`]);
        });
        return empty;
      };
      JobID.push(selectetJobID[0]);

      let added_job = TableData.map((e, company_i) => {
        if (company_i === job_index) {
          if (e.length > 1) {
            return [e[0], [...e[1], ...add(e[0][0].split("+")[1])]];
          }

          return [...e, [...add(e[0][0].split("+")[1])]];
        }

        return e;
      });

      setTableData(added_job);
      const newdata = Jobs.map((e) => {
        if (e.check === true) {
          return { ...e, status: true };
        }
        return { ...e };
      });

      setJobs(newdata);

      setmodalJobVisible(false);
    } else if (modalJobVisible === true && deletejob_modal === true) {
      // delete job
      let deletejob = TableData.map((e, i) => {
        if (company_index === i) {
          e[1].splice(job_index, 1);

          return [e[0], e[1]];
        }

        return e;
      });

      setTableData(deletejob);
      setdeletejob_modal(false);
      setmodalJobVisible(false);
    } else if (modalComapanyVisible === true && deleteComapany_modal === true) {
      // delete company
      let removed = Company.map((e) => {
        if (e.value.trim() === selectedcompanyname.trim()) {
          return { ...e, status: false, check: false };
        }
        return { ...e };
      });
      SetCompany(removed);
      //  SetCompany(removed); // var objIndex = AllCompany.filter((obj) => obj.value ==  selectedcompanyname); // Company.push(objIndex[0]);

      TableData.splice(company_index, 1);
      // GetCompany()
      setdeleteCompany_modal(false);
      setselectedcompanyname(null);
      setmodalComapanyVisible(false);
    } else if (deletePhase_modal === true) {
      // delete phase

      let delete_phase = TableData.map((e, i) => {
        if (company_index === i) {
          // into job array

          let jobs = e[1].map((jobs, jobs_i) => {
            if (jobs_i === job_index) {
              jobs[1].splice(phasejob_index, 1);

              return [jobs[0], jobs[1] ? jobs[1] : null];
            }

            return jobs;
          });

          return [e[0], jobs];
        }

        return e;
      });

      // var objIndex = AllPhase.filter((obj) => obj.value == selectedphasename);
      // Phase.push(objIndex[0]);

      setTableData(delete_phase);

      setdeletePhase_modal(false);

      setmodalPhaseVisible(false);
      setselectedphasename(null);
    } else if (modalPhaseVisible === true) {
      //  add phase row
      var phaseguid = generateGuidQuickly();
      var objIndex = Phase.forEach((obj, i) => { });

      for (let i = 0; i < SelectedPhase1.length; i++) {
        let added_phase;
        var objIndex = Phase.findIndex((obj) => {
          obj.value == SelectedPhase1[i];
        }); // Phase[objIndex].status = true;

        added_phase = TableData.map((e, company_i, job_i) => {
          if (company_i === company_index) {
            let changephase = e[1].map((j_data, j_index) => {
              if (j_index === phasejob_index) {
                if (j_data.length > 1) {
                  const add = (com_id, job_id) => {
                    let empty = [];
                    SelectedPhase1.forEach((array, array_index) => {
                      empty.push([
                        `${array}+${com_id}+${job_id}+${generateGuidQuickly()}`,
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                        "0/0/0",
                      ]);
                    });
                    return empty;
                  };
                  return [
                    j_data[0],
                    [
                      ...j_data[1],
                      ...add(e[0][0].split("+")[1], j_data[0].split("+")[2]),
                    ],
                  ];
                }

                const add = (com_id, job_id) => {
                  let empty = [];
                  SelectedPhase1.forEach((array, array_index) => {
                    empty.push([
                      `${array}+${com_id}+${job_id}+${generateGuidQuickly()}`,
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                      "0/0/0",
                    ]);
                  });
                  return empty;
                };

                return [
                  j_data[0],
                  [...add(e[0][0].split("+")[1], j_data[0].split("+")[2])],
                ];
              }

              return j_data;
            });

            return [[...e[0]], changephase];
          }

          return e;
        });

        setTableData(added_phase);
        setmodalPhaseVisible(false);

        var filterphase = Phase.filter((i) => i.status == false);
        setPhase(filterphase); // }
      }
    }
  };

  // Add company btn
  const elementCompanyButton = (item) => (
    <View style={styles.btncompany}>
      <TouchableOpacity onPress={() => alertCompany()}>
        <View>
          <Text>
            <Image
              source={require("../Image/addicon.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />{" "}
            ADD COMPANY
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Add Phase Btn
  const elementPhaseButton = (e, company_i, job_i) => (
    <View style={styles.btnphasecontainer}>
      <TouchableOpacity
        onPress={() => {
          let splited = e[1][job_i][0].split("-")[0];
          GetPhase(splited);

          // SetSelectedPhase([]);

          setalreadyExist([company_i, job_i]);
          alertPhase(e, company_i, job_i);
        }}
      >
        <View>
          <Text style={{ paddingLeft: "3%" }}>
            <Image
              source={require("../Image/addicon.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />{" "}
            ADD PHASE CODE
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Add Job btn
  const elementJobButton = (e, company_i) => (
    <View style={styles.btnjobcontainer}>
      <TouchableOpacity
        onPress={() => { 
          let splited = e[0][0].split("-")[0];
          GetJobs(splited, company_i);
          alertJob(e, company_i);
        }}
      >
        <View>
          <Text style={{ paddingLeft: "2%" }}>
            <Image
              source={require("../Image/addicon.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />{" "}
            ADD JOB
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Remove job btn
  const removejob_btn = (e, job_i, company_i) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          deletejob(e, job_i, company_i);
        }}
      >
        <View >
          <Text>
            {`${e}`}{" "}
            <Image
              source={require("../Image/minus.png")}
              Asen
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Text>

        </View>
      </TouchableOpacity>
    </View>
  );

  // remove company btn
  const removeCompany_btn = (e, company_i) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            deleteCompany(e, company_i);
          }}
        >
          <View>
            <Text style={{ paddingLeft: "1%" }}>
              {`${e}`}{" "}
              <Image
                source={require("../Image/minus.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // remove phase btn
  // "4811-A&E - M.E.P. Engineer+CMP_9cd54fe9-aa28-47fd-8a46-8c870a841223+JOB_05bed19d-c43a-40ce-b327-2dbe22851d0d+PHS_d2d0c5dd-7289-4960-93ab-beb9bdba2a90"
  const Create_btn_delete_pahse = (e, phase_i, job_i, company_i) => (
    <View style={styles.btnphcontainer}>
      <TouchableOpacity
        onPress={() => {
          deletePhase(e, phase_i, job_i, company_i);
        }}
      >
        <View  >
          <Text>
            {`${e.split("+")[0]}`}{" "}
            <Image
              source={require("../Image/minus.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />  </Text>

        </View>
      </TouchableOpacity>
    </View>
  );

  // Table Header
  const TableHead = [
    "Company | Job | Phase code",
    `Mon. ${weekdate[0]} \n ${totalgroup1.reg1}/${totalgroup1.ovt1}/${totalgroup1.dbl1}`,
    `Tue. ${weekdate[1]} \n ${totalgroup2.reg2}/${totalgroup2.ovt2}/${totalgroup2.dbl2}`,
    `Wed. ${weekdate[2]} \n ${totalgroup3.reg3}/${totalgroup3.ovt3}/${totalgroup3.dbl3}`,
    `Thu. ${weekdate[3]} \n ${totalgroup4.reg4}/${totalgroup4.ovt4}/${totalgroup4.dbl4}`,
    `Fri. ${weekdate[4]} \n ${totalgroup5.reg5}/${totalgroup5.ovt5}/${totalgroup5.dbl5}`,
    `Sat. ${weekdate[5]} \n ${totalgroup6.reg6}/${totalgroup6.ovt6}/${totalgroup6.dbl6}`,
    `Sun. ${weekdate[6]} \n ${totalgroup7.reg7}/${totalgroup7.ovt7}/${totalgroup7.dbl7}`,
    "TOTAL",
  ];
  const [btnData2, setbtnData2] = useState([elementCompanyButton(1)]);

  // this functiona call when user click to phase row and open scrollwheel (select hrs) popup will open.
  const get_set = (
    phases,
    company_i,
    job_i,
    phases_column_index,
    phases_row_index
  ) => {
    let splited = phases.split("/");
    settimes({
      RegularTime: splited[0],
      Overtime: splited[1],
      DBL: splited[2],
    });
    setselected_data([
      phases,
      company_i,
      job_i,
      phases_column_index,
      phases_row_index,
    ]);
    sethoursmodalVisible(true);
  };

  // date to update in database
  const GetDateTime = () => {
    let dateTime = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    return dateTime;
  };

  // Generate random user id
  const generateGuidQuickly = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };



  // let item = [];
  // let filteritem = TableData.map((e, i) => {
  //   e[1] &&
  //     e[1].map((d, j) => {
  //       d[1] &&
  //         d[1].forEach((m, k) => {
  //           if (m[8] != "0/0/0") {
  //             item.push(m);
  //           }
  //         });
  //     });
  // });
 
  const Save = async () => {
    const myPromise = new Promise((resolve, reject) => {

      let selectedusername = Usernamelist[indexvalue];
      let obj = {};
      obj[selectedusername] = TableData;
      dispatch(AddData(obj));
      resolve("foo");

    }).then(async () => {

      let Userid = await AsyncStorage.getItem("Userid");
      let SubmitUserID = await AsyncStorage.getItem("SubmitUserID");
      let resstatus = false;
      var TimesheetID2 = generateGuidQuickly();
      getUser.count.data.forEach(async (e) => {
        var TimesheetID = generateGuidQuickly();
        var DateTime = CurrentUTCTime();
        var Empresult;

        db.transaction(function (txn) {
          txn.executeSql("SELECT * FROM User", [], function (tx, res) {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }
            Empresult = temp.find(obj => {
              return obj.Username === Object.keys(e)[0]
            })
            if (res.rows.length != 0) {
              if (resstatus == false) {
                tx.executeSql(
                  "INSERT INTO Timesheet (TimesheetID, SubmittedByUserID, WeekEndDate,StatusID, CreatedBy, CreatedOn)" +
                  " VALUES (?, ?, ?, ?, ?, ?);",
                  [TimesheetID2, SubmitUserID,route.params&& route.params.paramKey, 1, SubmitUserID, DateTime],
                  function (tx, res) {
                    resstatus = true;
                  }
                );
              }
              txn.executeSql(
                "INSERT INTO TimesheetEmployee (TimesheetEmployeeID, TimesheetID, EmployeeID, CreatedBy, CreatedOn)" +
                " VALUES (?, ?, ?, ?, ?);",
                [TimesheetID, TimesheetID2, Empresult.EmployeeID, SubmitUserID, DateTime],
                function (tx, res) {
                  if (res.rowsAffected > 0) {
                    if (route.params&&route.params.paramKeyCompany.map((item)=>item.CompanyID).length == 0) {
                      navigation.setParams({paramKeyCompany: null});
                      navigation.navigate("HomeScreen");
                    }
                  } 
                }
              );
          
              if (route.params&&route.params.paramKeyCompany.map((item)=>item.CompanyID).length != 0) {
                // insert data into TimesheetCompany table
                for (let i = 0; i < Object.values(e)[0].length; i++) { 
                  txn.executeSql(
                    "INSERT INTO TimesheetCompany (TimesheetCompanyID,TimesheetEmployeeID, CompanyID, CreatedBy, CreatedOn)" +
                    " VALUES (?, ?, ?, ?, ?);",
                    [
                      Object.values(e)[0][i][0][0].split("+")[1],
                      TimesheetID,
                      Object.values(e)[0][i][0][0].split("-")[0],
                      SubmitUserID,
                      DateTime,
                    ],
                    async function (tx, res) {

                      if (route.params&&route.params.paramKeyCompany.map((item)=>item.JobID).length == 0) {
                        navigation.setParams({paramKeyCompany: null})
                        navigation.navigate("HomeScreen");
                      } else {
                        if (
                          Object.values(e)[0][i][1] &&
                          Object.values(e)[0][i][1]
                        ) {

                          Object.values(e)[0][i][1].forEach((ee, job_i) => { 
                            txn.executeSql(
                              "INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID, CreatedBy, CreatedOn)" +
                              "VALUES (?, ?, ?, ?, ?);",
                              [
                                ee[0].split("+")[1],
                                Object.values(e)[0][i][0][0].split("+")[1],
                                ee[0].split("-")[0],
                                SubmitUserID,
                                DateTime,
                              ],

                              async function (tx, results) {
                                if (route.params&&route.params.paramKeyCompany.map((item)=>item.PhaseCodeName).length == 0) {
                                  navigation.setParams({paramKeyCompany: null})
                                  navigation.navigate("HomeScreen");
                                }

                                if (
                                  Object.values(e)[0][i][1] &&
                                  Object.values(e)[0][i][1][job_i] &&
                                  Object.values(e)[0][i][1][job_i][1]
                                ) {
                                
                              
                                  for (
                                    let j = 0;
                                    j <
                                    Object.values(e)[0][i][1][job_i][1].length;
                                    j++
                                  ) { 
                                    var Mon =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][1].split("/");
                                    var Tues =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][2].split("/");
                                    var Wed =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][3].split("/");
                                    var Thurs =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][4].split("/");
                                    var Fri =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][5].split("/");
                                    var Sat =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][6].split("/");
                                    var Sun =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][7].split("/");
                                   
                                    txn.executeSql(
                                      "INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours, Comment, CreatedBy, CreatedOn,Active,Total_Reg,Total_Ot,Total_Dbl)" +
                                      " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?,?);",
                                      [
                                        Object.values(e)[0][i][1][job_i][1][j][0].split("+")[1],
                                        Object.values(e)[0][i][1][job_i][0].split("+")[1],
                                        Object.values(e)[0][i][1][job_i][1][j][0].split("-")[0],
                                        Mon[0],
                                        Mon[1],
                                        Mon[2],
                                        Tues[0],
                                        Tues[1],
                                        Tues[2],
                                        Wed[0],
                                        Wed[1],
                                        Wed[2],
                                        Thurs[0],
                                        Thurs[1],
                                        Thurs[2],
                                        Fri[0],
                                        Fri[1],
                                        Fri[2],
                                        Sat[0],
                                        Sat[1],
                                        Sat[2],
                                        Sun[0],
                                        Sun[1],
                                        Sun[2],
                                        "Commands",
                                        SubmitUserID,
                                        DateTime,
                                        0,
                                        Object.values(e)[0][i][1][job_i][1][j][8].split("/")[0],
                                        Object.values(e)[0][i][1][job_i][1][j][8].split("/")[1],
                                        Object.values(e)[0][i][1][job_i][1][j][8].split("/")[2]
                                      ],
                                      async function (tx, results) {
                                        navigation.setParams({paramKeyCompany: null})
                                      }
                                    );
                                  }
                                }
                              },
                              err => {
                                console.error("err", err);
                              },
                            );
                          });
                        }
                      }
                    }
                  );
                }
                // navigation.navigate("HomeScreen");
              }
            }
          });
        });
        navigation.setParams({paramKeyCompany: null})
        navigation.navigate("HomeScreen");
      });

    })

    // })
  };

  const changeusernameASC = () => {
    setPageLoading(true)
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue) {
        setindexvalue(indexvalue + 1);
        let selectedusername = Usernamelist[indexvalue];

        let obj = {};
        obj[selectedusername] = TableData;
        obj["total_RegularTime"] = total_RegularTime;
        obj["total_DBL"] = total_DBL;
        obj["total_Overtime"] = total_Overtime;
        dispatch(AddData(obj));

        setTableData([]);
        settotal_Overtime(0);
        settotal_DBL(0);
        settotal_RegularTime(0);

        if (getUser.count.data.length !== 1) {
          let objArr = Object.values(getUser.count.data)[indexvalue + 1];

          let res = Usernamelist[indexvalue + 1]

          objArr && setTableData(objArr[res])
          objArr && settotal_Overtime(objArr['total_Overtime']);
          objArr && settotal_DBL(objArr['total_DBL']);
          objArr && settotal_RegularTime(objArr['total_RegularTime']);
        }


      }
      setPageLoading(false)
    }, 1000);
  };
  useEffect(()=>{
    GetCompany()
  },[indexvalue])
 
  const changeusernameDEC = () => {
    setPageLoading(true);
    
    setTimeout(() => {

      if (Usernamelist.length >= indexvalue && indexvalue >= 0) {
        // post
        setindexvalue(indexvalue - 1);
        
        let selectedusername = Usernamelist[indexvalue];
        let obj = {};
        obj[selectedusername] = TableData;
        obj["total_RegularTime"] = total_RegularTime;
        obj["total_DBL"] = total_DBL;
        obj["total_Overtime"] = total_Overtime;
        dispatch(AddData(obj));

        setTableData([]);
        settotal_Overtime(0);
        settotal_DBL(0);
        settotal_RegularTime(0);

        let objArr = Object.values(getUser.count.data)[indexvalue - 1];

        var res = Usernamelist[indexvalue - 1]

        setTableData(objArr[res])
        objArr && settotal_Overtime(objArr['total_Overtime']);
        objArr && settotal_DBL(objArr['total_DBL']);
        objArr && settotal_RegularTime(objArr['total_RegularTime']);


      }
      setPageLoading(false)
    }, 1000);
  };





  //  reamove employee
  const RemoveEmployee = () => {
    let selectedusername = Usernamelist[indexvalue];

    if (Usernamelist.length !== 1) {

      Alert.alert('Are You Sure Want To Remove', `${selectedusername}`, [
        {
          text: 'Cancel',
      
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {



            dispatch(RemoveData(selectedusername));
            let removed = Usernamelist.filter(e => e !== selectedusername)



            setUsernamelist([...removed])

            let added = Employee.map(e => {
              if (e.key === selectedusername) {
                return {
                  ...e,
                  check: false,
                  status: false
                }
              }
              return e
            })
            setEmployee([...added])
          }
        },
      ]);
    }






    //   if(selectedusername!=LoginUsername){
    //   let obj = {};
    //   obj[selectedusername] = TableData;
    //   dispatch(AddData(obj));
    //   const findOne = getUser.count.data.findIndex(item => item.hasOwnProperty(selectedusername))
    //   var filteredArray =Usernamelist.filter(function(e) { return e !== selectedusername })

    //    dispatch(RemoveData(findOne));
    //    setUsernamelist(filteredArray)
    //    let modified = Employee.map((e) => {

    //     if (e.key === selectedusername) {
    //       return { ...e, status: false,check:false };
    //     }

    //     return { ...e };
    //   });

    //  setEmployee(modified);
    // }
    //  else{
    //  // setUsernamelist(selectedusername)

    //   let obj = {};
    //   obj[selectedusername] = TableData;
    //   dispatch(AddData(obj));

    //    alert("You can't Remove login Employee")

    // }

  }
  if (Pageloading == true) {
    return (
      <View style={styles.Pageloading}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {/* select times modal */}
        {process_loader?<Processing />:null}
        {popup_twentyfour?<Timesheet_popup setpopup_twentyfour={setpopup_twentyfour} type={"24hourspopup"}/>:null}
        {popup_entry?<Timesheet_popup setpopup_entry={setpopup_entry} type={"emptyentry"}/>:null}
  
  
        <Scroll_modal
        setpopup_twentyfour={setpopup_twentyfour}
          setData={setData}
          hoursmodalVisible={hoursmodalVisible}
          sethoursmodalVisible={sethoursmodalVisible}
          times={times}
          selected_data={selected_data}
          TableData={TableData}
          setTableData={setTableData}
          settimes={settimes}
          settotal_RegularTime={settotal_RegularTime}
          settotal_Overtime={settotal_Overtime}
          settotal_DBL={settotal_DBL}
          settotalgroup1={settotalgroup1}
          settotalgroup2={settotalgroup2}
          settotalgroup3={settotalgroup3}
          settotalgroup4={settotalgroup4}
          settotalgroup5={settotalgroup5}
          settotalgroup6={settotalgroup6}
          settotalgroup7={settotalgroup7}
          settotalgroup8={settotalgroup8}
        />
  
  
        {/* add or insert new company module */}
        {modalComapanyVisible && deleteComapany_modal === false ? (
          <AddCompany
            handleAddRow={handleAddRow}
            Company={Company}
            SetCompanyID={SetCompanyID}
            SetCompany={SetCompany}
            GetJobs={GetJobs}
            loading={Companyloading}
            setmodalComapanyVisible={setmodalComapanyVisible}
          />
        ) : null}
  
        {/* add or insert new company module */}
        {modalEmployeeVisible && deleteEmployee_modal === false ? (
          <AddEmployee
            AddEmployeeName={AddEmployeeName}
            deleteEmployee_modal={deleteEmployee_modal}
            Employee={Employee}
            setEmployee={setEmployee}
            GetEmployee={GetEmployee}
            loading={Employeeloading}
            setprocess_loader={setprocess_loader}
            setmodalEmployeeVisible={setmodalEmployeeVisible}
          />
        ) : null}
        {/* Delete Company modal popup*/}
        <Delete_Company_Pop
          deleteComapany_modal={deleteComapany_modal}
          handleAddRow={handleAddRow}
          setmodalComapanyVisible={setmodalComapanyVisible}
          setdeleteCompany_modal={setdeleteCompany_modal}
          company_index={company_index}
        />
  
        {/* add or insert job row in addjob module */}
        {modalJobVisible && deletejob_modal === false ? (
          <AddJob
            Jobs={Jobs}
            selectedJob={selectedJob}
            GetPhase={GetPhase}
            handleAddRow={handleAddRow}
            setmodalJobVisible={setmodalJobVisible}
            setJobs={setJobs}
            loading={Jobloading}
          />
        ) : null}
  
        {/* Delete job modal popup */}
        <Delete_Job_Pop
          deletejob_modal={deletejob_modal}
          setmodalJobVisible={setmodalJobVisible}
          setdeletejob_modal={setdeletejob_modal}
          handleAddRow={handleAddRow}
        />
  
        {/* add or insert job row in addphase module*/}
        {modalPhaseVisible && deletePhase_modal === false ? (
          <AddPhase
            setmodalPhaseVisible={setmodalPhaseVisible}
            setdeletePhase_modal={setdeletePhase_modal}
            deletePhase_modal={deletePhase_modal}
            handleAddRow={handleAddRow}
            Phase={Phase}
            loading={Phaseloading}
            setPhase={setPhase}
            SetSelectedPhase={SetSelectedPhase}
          />
        ) : null}
        {/* Delete Phase modal popup */}
  
        <Delete_Phase_Pop
          deletePhase_modal={deletePhase_modal}
          setmodalPhaseVisible={setmodalPhaseVisible}
          setdeletePhase_modal={setdeletePhase_modal}
          handleAddRow={handleAddRow}
        />
  
        {/* Progress Meter */}
        <View style={styles.containerblue}>
          <View style={styles.headerblue}>
            <Text style={styles.headerbluetext}>IN PROGRESS</Text>
          </View>
        </View>
  
        <View style={styles.header}>
  
          {Usernamelist.length===0?<View><Text></Text></View>: <View style={styles.Usernamelist}>
            {/* descending */}
            {indexvalue > 0 && indexvalue != Usernamelist.length ? (
              <TouchableOpacity onPress={changeusernameDEC}>
                <Text style={styles.textname}> &#60;</Text>
              </TouchableOpacity>
            ) : null}
            <Text style={styles.textname}>{Usernamelist.length==1?Usernamelist[0]:Usernamelist[indexvalue]}</Text>
            {/* ascending */}
            {indexvalue >= 0 && indexvalue < Usernamelist.length - 1 ? (
              <TouchableOpacity onPress={changeusernameASC}>
                <Text style={styles.textname}> &#62;</Text>
              </TouchableOpacity>
            ) : null}
          </View>}
  
  
          <View style={{ width: "25%" }}>
            <TouchableOpacity onPress={Save}>
              <Text style={styles.backbtn}>&#60; Back to all Timesheets</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={{ padding: 10 }}>
          {/* <View style={styles.Savecontainer}>
            <Pressable
              onPress={Save}
              style={data != null ? styles.btn : styles.disabledbtn}
            >
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>   */}
          <View style={styles.headerrow}>
            <View style={styles.SectionStyle}>
              <View style={styles.headerrow}>
                <Text style={styles.label}>Week Ending:</Text>
                <TextInput
                  style={styles.headerinputStyle}
                  placeholder=""
                  defaultValue={route.params.paramKey}
                  maxLength={17}
                />
              </View>
            </View>
            <View style={styles.SectionStyle2}>
              {Usernamelist.length===0?null:
              <View style={styles.headerrow}>
              <Text style={styles.label}> Total Time:</Text>
  
              <Text style={styles.labelone} maxLength={17}>
                {" "}
                {total_RegularTime} reg / {total_Overtime} ot / {total_DBL} dbl    </Text>
  
            </View> }
  
            </View>
            <View style={styles.wholecontainer}>
              {Usernamelist.length===0?
                <View style={styles.circlecontainer}>
                 <TouchableOpacity
  style={{opacity:0}}
                 activeOpacity={0.1}
                  underlayColor="#ccc"
                  onPress={() => null}
                >
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Copy} />
                    </View>
                    <Text style={styles.circletext}>Copy Timesheet</Text>
                  </View>
                </TouchableOpacity>
  
  
                <TouchableOpacity
                style={{opacity:0}}
                  underlayColor="#ccc"
                  onPress={RemoveEmployee}
                >
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Remove} />
                    </View>
                    <Text style={styles.circletext}>Remove Employee</Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity underlayColor="#ccc" onPress={alertEmployee} >
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Add} />
                    </View>
                    <Text style={styles.circletext}>New Employee</Text>
                  </View>
                </TouchableOpacity>
  
  
  
                </View>:
                <View style={styles.circlecontainer}>
                <TouchableOpacity
                  underlayColor="#ccc"
                  onPress={() => {
                    TableData&&TableData.length===0?setpopup_entry(true):null
                  }}
                >
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Copy} />
                    </View>
                    <Text style={styles.circletext}>Copy Timesheet</Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity underlayColor="#ccc" onPress={alertEmployee}>
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Add} />
                    </View>
                    <Text style={styles.circletext}>New Employee</Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity
                  underlayColor="#ccc"
                  onPress={RemoveEmployee}
                >
                  <View style={styles.buttonscontainer}>
                    <View style={styles.circle}>
                      <Image style={styles.logo} source={Remove} />
                    </View>
                    <Text style={styles.circletext}>Remove Employee</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
  
            </View>
          </View>
        </View>
  
  
  
        {/* Table Component */}
        {Usernamelist.length===0?null:<View style={{ flex: 1, padding: 16 }}>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#9c9a9a" }}>
            {/* Table Head */}
            <Row
              data={TableHead}
              flexArr={[3]}
              style={styles.head}
              textStyle={styles.headtextfont}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table>
              {/* Table Body */}
              <TableWrapper>
                {TableData && TableData.map((e, company_i) => {
                  let concat = e[0][0].split('+')[0]
                  return (
                    <>
                      {/* company name */}
                      {/* remove comapany row */}
                      <Cell
                        key={company_i}
                        data={removeCompany_btn(concat, company_i)}
                        flexArr={[3]}
                        style={styles.companystyle}
                        textStyle={styles.textfont2}
                      />
                      {e[1]
                        ? e[1].map((ss, job_i) => (
                          <>
                            {/* Company job */}
                            {/*  Remove Job Btn */}
                            <Cell
                              data={removejob_btn(
                                [ss[0]][0].split("+")[0],
                                job_i,
                                company_i
                              )}
                              flexArr={[3]}
                              key={job_i}
                              style={styles.jobstyle}
                              textStyle={styles.textfont2}
                            />
                            {/* phase row */}
                            {ss[1]
                              ? ss[1].map((qq, phase_id) => {
                                const clickable = (
                                  individual_phases_value,
                                  phases_column_index
                                ) => {
                                  return individual_phases_value.map(
                                    (phases, phases_row_index) => {
                                      if (phases_row_index === 7) {
                                        return (
                                          <TouchableOpacity>
                                            <View style={styles.ridesFriends}>
                                            <View style={styles.verticleLine}></View>
                                              <Text
                                                style={{
                                                  fontSize: 16,
                                                  backgroundColor: "transparent",
                                                  textAlign: "center",
                                                  width:'100%'
                                                }}
                                              >
                                                {phases}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        );
                                      }
                                      return (
                                        <Pressable style={{width:'100%'}}
                                          onPress={() =>
                                            get_set(
                                              phases,
                                              company_i,
                                              job_i,
                                              phases_column_index,
                                              phases_row_index
                                            )
                                          }
                                        >
                                          <View style={styles.ridesFriends}>
                                          <View style={styles.verticleLine}></View>
                                            <Text
                                              style={{
                                                fontSize: 16,
                                                backgroundColor: "transparent",
                                                textAlign: "center",
                                                width:'100%'
                                              }}
                                            >
                                              {phases === "0/0/0"
                                                ? ""
                                                : phases}
                                            </Text>
  
                                          </View>
                                        </Pressable>
                                      );
                                    }
                                  );
                                };
  
                                return (
                                  <Rows
                                    data={[
                                      [
                                        Create_btn_delete_pahse(
                                          qq[0],
                                          phase_id,
                                          job_i,
                                          company_i
                                        ),
                                        ...clickable(qq.slice(1), phase_id),
                                      ],
                                    ]}
                                    flexArr={[3]}
                                  //  style={styles.phasestyle}
                                    style={[styles.phasestyle, phase_id%2 && {backgroundColor: '#f7f5f8'}]}
                                    textStyle={styles.textfont2}
                                  />
                                );
                              })
                              : null}
                            {/* Add phase btn */}
                            <Cell
                              data={elementPhaseButton(e, company_i, job_i)}
                              flexArr={[3]}
                              style={styles.row}
                              textStyle={styles.textfont2}
                            />
  
                          </>
                        ))
                        : null}
                      {/* Add Job Btn */}
                      <Cell
                        data={elementJobButton(e, company_i)}
                        flexArr={[3]}
                        style={styles.row}
                        textStyle={styles.textfont2}
                      />
                    </>
                  );
                })}
              </TableWrapper>
  
             {TableData&&TableData.length===0?<View style={{width:"100%",height:35,backgroundColor:"#D3D3D3"}}><Text style={{fontSize:20}}>No data found</Text></View>:<></>}
              {/* Add company btn */}
              <Row
                data={btnData2}
                flexArr={[3]}
                style={styles.row}
                textStyle={styles.textfont2}
              />
            </Table>
          </ScrollView>
  
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "grey",
            }}
          ></Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "grey",
            }}
          ></Text>
        </View>}
  
       {Usernamelist.length===0?<Text style={{position:"absolute",bottom:0}}>  No employee exist in the current timesheet.Click the plus button above to add employees</Text>:null}
  
      </SafeAreaView>
    );
  }
};

export default CopyTimeSheetScreen;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
  },
  head: { height: 60, backgroundColor: "#9c9a9a" },
  headtextfont: { margin: 6, textAlign: "center", color: "#fff" },
  textfont2: { margin: 6, textAlign: "left", fontWeight: "bold" },
  btn: {
    width: 100,
    height: 18,
    backgroundColor: "#307ecc",
    borderRadius: 2,
    marginLeft: 5,
  },
  btnText: { textAlign: "center", color: "#fff" },
  btnjobcontainer: {
    // marginLeft: '5%',
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#edebeb",
    padding: "0.5%",
  },

  // btnphcontainer: {
  //   // marginLeft: '5%',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   backgroundColor:'#edebeb',
  //   padding:'0.5%',
  //   marginRight:'30%'
  // },
  btnphasecontainer: {
    backgroundColor: "#e8e9eb",
    padding: "0.5%",
    display: "flex",
    textAlign: "left",
    flexDirection: "row",
  },
  row: {
    height: 40,
  },
  companystyle: {
    backgroundColor: "#cccccc",
    paddingTop: "1%",
    // backgroundColor: "#acadad",
    paddingBottom: "0.5%",
  },
  jobstyle: {
    backgroundColor: "#ebe8e8",
    padding: "0.5%",
    paddingTop: "1%",
    paddingLeft: "2%",
  },
  phasestyle: {
    // borderWidth:0.5,
    // paddingLeft:'10%',
    paddingLeft: "3%",
    padding: "0.5%",
    paddingTop: "1%",
    // borderColor: "#cccccc",
    backgroundColor: "#fff",
  },

  containerblue: {
    backgroundColor: "#f5f3f5",
    borderWidth: 5,
    borderColor: "#fff",
    borderStyle: "solid",
    width: "auto",
  },
  headerblue: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#4478de",
    padding: 10,
    width: "100%",
  },
  headerbluetext: {
    textAlign: "center",
    fontSize: 25,
    color: "#fff",
    letterSpacing: 2,
  },

  headerrow: {
    flexDirection: "row",
  },
  SectionStyle: {
    height: 50,
    margin: 10,
    borderColor: "white",
    width: "20%",
    justifyContent: "flex-end",
  },
  SectionStyle2: {
    height: 50,
    marginTop: 0,
    margin: 10,
    borderColor: "white",
    width: "20%",
    justifyContent: "flex-end",
  },
  label: {
    fontWeight: "bold",
    color: "#c1c0c1",
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
  },
  labelone: {
    fontWeight: "bold",
    color: "#797679",
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
  },
  headerinputStyle: {
    flex: 1,
    color: "#c1c0c1",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
    borderLeftWidth: 8,
    borderColor: "#E8E8E8",
    fontWeight: "bold",
    fontSize: 18,
  },
  btncompany: {
    padding: "0.3%",
    backgroundColor: "#e6e7e8",
  },
  Savecontainer: {
    alignSelf: "flex-end",
  },
  btn: {
    padding: 10,
    borderColor: "blue",
    width: 100,
    backgroundColor: "#4478de",
  },
  disabledbtn: {
    padding: 10,
    borderColor: "blue",
    width: 100,
    backgroundColor: "#d3d3d3",
  },
  logo: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: 20,
    marginTop: 25,
  },
  Usernamelist: {
    justifyContent: "center",
    flexDirection: "row",
  },
  textname: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "#1b386a",
    marginBottom: -30,
  },
  backbtn: {
    fontSize: 25,
    color: "#6ca4d6",
    fontWeight: "500",
  },

  circle: {
    borderRadius: 40,
    width: 50,
    height: 50,
    backgroundColor: "#1b386a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
  },
  logo: {
    width: 25,
    height: 25,
  },
  circlecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
  },
  circlecontainer_newEmployeeOnly: {

    flexDirection: "row",
    alignItems: "center",
    // marginLeft: "5%",
    // width:"100%",
    backgroundColor: "red",
    position: "relative",
    // paddingLeft:"30%"
  },
  wholecontainer: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  circletext: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1b386a",
    marginLeft: 10,
    marginRight: 20,
  },
  buttonscontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  verticleLine: {
    height: '250%',
    width: 1,
    backgroundColor: '#cac8ca',

  },
  ridesFriends: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  Pageloading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
