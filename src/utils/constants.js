// export const API = "https://proctored-backend.onrender.com/api";
export const API = "http://localhost:8800/api"
export const companyName = `ETL Hive`;
export const lgHyphenName = `etl-hive`;
export const smHyphenName = `etl-hive`;

export const pdfCompanyName = `ETL Hive`;


const IST_OFFSET = 5.5 * 60 * 60 * 1000;
const istDate = new Date(Date.now() + IST_OFFSET);
export const todayUTC = istDate.toISOString().split("T")[0];

const tokenResponse = localStorage.getItem("accessToken");
let token = null;

if (tokenResponse) {
  try {
    const tokenData = JSON.parse(tokenResponse);
    token = tokenData ? tokenData.token : null;
  } catch (error) {
    console.error("Error parsing accessToken from localStorage:", error);
  }
}

export const API_TOKEN = {
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
};

// Fetch and parse the user data from localStorage
export const getUserData = () => {
  const userString = localStorage.getItem("user");
  let userData = null;

  if (userString !== null && userString !== undefined) {
    try {
      userData = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      localStorage.clear(); // Clear localStorage on error
    }
  } else {
    localStorage.clear(); // Clear localStorage if userString is null or undefined
  }

  return userData;
};