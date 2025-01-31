import Ajv, { Schema } from "ajv";

const ajv = new Ajv();

export const ValidateRequest = <T>(requestBody: unknown, schema: Schema)=>{
    const validateData = ajv.compile<T>(schema);

    if (validateData(requestBody)) {
        return false;
    }

    const error = validateData.errors?.map((err)=>err.message);

    return error && error[0]
}