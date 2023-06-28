import React from 'react';
import db from './db';
const DeviceSynchTable = (Device) => {
     
    db.transaction(async function (txn) { 
        for (let i = 0; i < Device.length; i++) {  
        txn.executeSql(
        `INSERT INTO DeviceSynchTable (TableName,HasInitialDataSynch, HasDataDownloadToDevice, HasDataUploadFromDevice, HasFileDownloadToDevice
          HasFileUploadFromDevice,UpdateSortID,SynchOnlyColumns,UseOnlyForAlerts)` +
          `VALUES (?,?,?,?,?,?,?.?,?);`,
        [
         
          Device[i].tableName,
          Device[i].hasInitialDeviceSynch,
          Device[i].hasDataDownloadToDevice,
          Device[i].hasDataUploadFromDevice,
          Device[i].hasFileDownloadToDevice,
          Device[i].hasFileUploadFromDevice,
          Device[i].updateSortId,
          Device[i].synchOnlyColumns,
          Device[i].useOnlyForAlerts 
        ],
        
         async function (tx, results) { 
         
           
            }) 
            
          } 
         
        })
    }
    const LkpTimesheetStatusTable = (TimesheetStatus) => { 
        db.transaction(async function (txn) { 
            for (let i = 0; i < TimesheetStatus.length; i++) {  
            txn.executeSql(
            `INSERT INTO LkpTimesheetStatus (StatusID,StatusName)` +
              `VALUES (?,?);`,
            [
             
              TimesheetStatus[i].statusId,
              TimesheetStatus[i].statusName 
            ],
            
             async function (tx, results) { 
             
               
                }) 
                
              } 
             
            })
        }
        const LkpCompanyTable = (LkpCompany) => { 
          db.transaction(async function (txn) { 
              for (let i = 0; i < LkpCompany.length; i++) {  
              txn.executeSql(
              `INSERT INTO LkpCompany (CompanyID,CompanyName,PhaseGroup,IsActive)` +
                `VALUES (?,?,?,?);`,
              [
               
                LkpCompany[i].companyId,
                LkpCompany[i].companyName ,
                LkpCompany[i].phaseGroup,
                LkpCompany[i].isActive 
              ],
              
               async function (tx, results) { 
               
                 
                  }) 
                  
                } 
               
              })
          }

          const LkpJobsTable = (LkpJobs) => { 
            db.transaction(async function (txn) { 
                for (let i = 0; i < LkpJobs.length; i++) {  
                txn.executeSql(
                `INSERT INTO LkpJob (JobID,JobNo,CompanyID,JobName,IsActive,IsRestricted,ProjectMgr,udEstimator,udProjectEngineer,udProjectAssistant,
                  udProjectAccountant,udCarpenterForeman,udSuperintendent,udSPEstimator,udSP3Estimator,udSP3Foreman,udPrincipal,udSuperintendant2,
                  udPM2,udEstimator2,udPE2,udMEPCoord,udEstimator3,udEstimator4,udEstimator5,udEstimator6,udJobStatus,udPMFieldCoordinatorPainting,
                  udPMSPProjectManagerPainting,udPMSPProjectManagerCarpentry,udPMFieldCoordinatorCarpentry)` +
                  `VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                [
                 
                  LkpJobs[i].jobId,
                  LkpJobs[i].jobNo,
                  LkpJobs[i].companyId,
                  LkpJobs[i].jobName,
                  LkpJobs[i].isActive,
                  LkpJobs[i].isRestricted,
                  LkpJobs[i].projectMgr,
                  LkpJobs[i].udEstimator,
                  LkpJobs[i].udProjectEngineer,
                  LkpJobs[i].udProjectAssistant,
                  LkpJobs[i].udProjectAccountant,
                  LkpJobs[i].udCarpenterForeman,
                  LkpJobs[i].udSuperintendent,
                  LkpJobs[i].udSpestimator,
                  LkpJobs[i].udSp3estimator,
                  LkpJobs[i].udSp3foreman,
                  LkpJobs[i].udPrincipal,
                  LkpJobs[i].udSuperintendant2,
                  LkpJobs[i].udPm2,
                  LkpJobs[i].udEstimator2,
                  LkpJobs[i].udPe2,
                  LkpJobs[i].udMepcoord,
                  LkpJobs[i].udEstimator3,
                  LkpJobs[i].udEstimator4,
                  LkpJobs[i].udEstimator5,
                  LkpJobs[i].udEstimator6,
                  LkpJobs[i].udJobStatus,
                  LkpJobs[i].udPmfieldCoordinatorPainting,
                  LkpJobs[i].udPmspprojectManagerPainting,
                  LkpJobs[i].udPmspprojectManagerCarpentry,
                  LkpJobs[i].udPmfieldCoordinatorCarpentry
                ],
                
                 async function (tx, results) { 
                 
                   
                    }) 
                    
                  } 
                 
                })
            }

            const LkpPhaseCodesTable = (LkpPhaseCodes) => { 
              db.transaction(async function (txn) { 
                  for (let i = 0; i < LkpPhaseCodes.length; i++) {  
                  txn.executeSql(
                  `INSERT INTO LkpPhaseCode(PhaseCodeID,PhaseGroup,PhaseCode,PhaseCodeName,JobID,IsActive,AllowFieldUse,IsRestricted)` +
                    `VALUES (?,?,?,?,?,?,?,?);`,
                  [
                   
                    LkpPhaseCodes[i].phaseCodeId,
                    LkpPhaseCodes[i].phaseGroup,
                    LkpPhaseCodes[i].phaseCode,
                    LkpPhaseCodes[i].phaseCodeName,
                    LkpPhaseCodes[i].jobId,
                    LkpPhaseCodes[i].isActive,
                    LkpPhaseCodes[i].allowFieldUse,
                    LkpPhaseCodes[i].isRestricted
                    
                  ],
                  
                   async function (tx, results) { 
                   
                     
                      }) 
                      
                    } 
                   
                  })
              }
        const UserTable = (User) => { 
            db.transaction(async function (txn) {  
            for (let i = 0; i < User.length; i++) { 
            txn.executeSql(
            `INSERT INTO User (UserID,EmployeeID, Username, Password, IsSubmitter,IsApprover,IsActive,HasEstimatedProjectCompletionDate,CreatedBy,
              CreatedOn,UpdatedBy,UpdatedOn,IsEwa)` +
              `VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            [
                User[i].userId,
                User[i].employeeId,
                User[i].username,
                User[i].password,
                User[i].isSubmitter,
                User[i].isApprover,
                User[i].isActive,
                User[i].hasEstimatedProjectCompletionDate,
                User[i].createdBy,
                User[i].createdOn,
                User[i].updatedBy,
                User[i].updatedOn,
                User[i].isEwa
            ],
            
             async function (tx, results) {
              
                }) 
                
              } 
            })
        }
        const EmployeeTable = (Employee) => { 
            db.transaction(async function (txn) { 
                for (let i = 0; i < Employee.length; i++) {  
                txn.executeSql(
                `INSERT INTO Employee (EmployeeID,VPEmployeeID, CompanyID, ApproverID, FullName,IsActive,
                  UserRole,UserGroup,IsRestricted,Company1,Company2,Company3,Company4,Company5,LogAtCompanyLevel,EarningsCode,PayrollDept,
                  AutoEarnings,CreatedBy,
                  CreatedOn,UpdatedBy,UpdatedOn)` +
                  `VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                [
                 
                  Employee[i].employeeId,
                  Employee[i].vpemployeeId,
                  Employee[i].companyId,
                  Employee[i].approverId,
                  Employee[i].fullName,
                  Employee[i].isActive,
                  Employee[i].userRole,
                  Employee[i].userGroup,
                  Employee[i].isRestricted,
                  Employee[i].company1,
                  Employee[i].company2,
                  Employee[i].company3,
                  Employee[i].company4,
                  Employee[i].company5,
                  Employee[i].logAtCompanyLevel,
                  Employee[i].earningsCode,
                  Employee[i].payrollDept,
                  Employee[i].autoEarnings,
                  Employee[i].createdBy,
                  Employee[i].createdOn,
                  Employee[i].updatedBy,
                  Employee[i].updatedOn 
                ],
                
                 async function (tx, results) { 
                 
                   
                    }) 
                    
                  } 
                  
                  
                })

        }
export default {DeviceSynchTable,LkpTimesheetStatusTable,LkpCompanyTable,LkpJobsTable,LkpPhaseCodesTable, UserTable,EmployeeTable};