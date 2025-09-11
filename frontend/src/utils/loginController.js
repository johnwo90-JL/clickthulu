import { apiAdress, loginUserAdress } from "./api";

const loginUser = async (postdata) => {
  if (postdata != null) {
    try {
      const response = await fetch(`${apiAdress}${loginUserAdress}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      window.cookieStore.set(
        "Authorisation",
        `Bearer ${response.body.accessToken}`
      );
      console.log(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default loginUser;
