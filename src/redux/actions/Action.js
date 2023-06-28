export const AddData = data => {
  return {
    type: 'Added',
    payload: data,
  };
};

export const RemoveData = data => {
  return {
    type: 'Remove',
    payload: data,
  };
};

//dummy
export const Temp_Add = data => {
  return {
    type: 'Addedd',
    payload: data,
  };
};

export const Temp_Remove = data => {
  return {
    type: 'Removee',
    payload: data,
  };
};

export const delete1 = data => {
  return {
    type: 'delete',
  };
};

export const delete2 = data => {
  return {
    type: 'deletee',
  };
};

export const Add_Date = data => {
  return {
    type: 'Add_Date',
    payload: data,
  };
};

export const Remove_Date = data => {
  return {
    type: 'Remove_Date',
  };
};

export const Add_Empl_Copy = data => {
  return {
    type: 'Add_Empl_Copy',
    payload: data,
  };
};

export const Remove_Empl_Copy = data => {
  return {
    type: 'Remove_Empl_Copy',
    payload: data,
  };
};

export const delete3 = data => {
  return {
    type: 'deleteee',
  };
};

export const change = () => {

  return {
    type: 'change' 
  };
};
export const callFunctionAction = (data) => {
  return {
    type: 'CALL_FUNCTION',
    payload:data
  };
};

export const menu_save_time = data => {

  return {
    type: 'menu_save_time',
    payload: data,

  };
};



export const Approve_Hold = data => {

  return {
    type: 'Approve_Hold',
    payload: data,

  };
};