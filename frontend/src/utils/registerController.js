import { apiAdress, createUserAdress } from "./api";

const createUser = async (postdata) => {
  if (postdata != null) {
    try {
      const response = await fetch(`${apiAdress}${createUserAdress}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      console.log(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default createUser;
