



export interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    icon?: string;
    fullWidth?: boolean;
    grouped?: boolean;
  }
  export interface FormProps {
    formType: string;
    fields: FormField[];
    onSubmit: (formData: UserDataTypes) => void;
  }
  export interface UserDataTypes {
    email : string,
    username : string,
    password : string
}   

export interface userLoginType{
    email: string;
    password: string;
}