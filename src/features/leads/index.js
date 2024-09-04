import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputText from "../../components/Input/InputText";
import { showNotification } from "../common/headerSlice";
import axios from "axios";
// import { API, API_TOKEN } from "../../../utils/constants";
import TitleCard from "../../components/Cards/TitleCard";
import { API, API_TOKEN } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
// import { handleError } from "../../../utils/errorUtils";

function Leads() {
  const INITIAL_ACCOUNT_OBJ = {
    name: "",
    email: "",
    contact: "",
    product: "default",
  };

  const [accountObj, setAccountObj] = useState(INITIAL_ACCOUNT_OBJ);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  // let userId = "";

  const submitForm = async (e) => {
    e.preventDefault();
    const contact = accountObj.contact.toString().trim();
    if (accountObj.name.trim() === "") {
      dispatch(
        showNotification({
          message: "Name is required!",
          status: 0,
        })
      );
      return;
    }
    if (accountObj.email.trim() === "") {
      dispatch(
        showNotification({
          message: "Email is required!",
          status: 0,
        })
      );
      return;
    }
    if (!isEmailValid(accountObj.email)) {
      dispatch(
        showNotification({
          message: "Email is required!",
          status: 0,
        })
      );
      return;
    }
    if (contact === "" || contact.length !== 10) {
      dispatch(
        showNotification({
          message: "Contact number must be 10 digits!",
          status: 0,
        })
      );
      return;
    }

    if (accountObj.product === "default") {
      dispatch(
        showNotification({
          message: "Product is required.",
          status: 0,
        })
      );
      return;
    } else {
      accountObj.name = accountObj.name.trim();
      accountObj.email = accountObj.email.trim();
      accountObj.contact = contact;
      accountObj.product = accountObj.product.trim();

      try {
        const response = await axios.post(
          `${API}/leads`,
          accountObj,
          API_TOKEN
        );

        if (response.status === 201) {
          setAccountObj(INITIAL_ACCOUNT_OBJ);
          // console.log("")
          window.alert("successfully submitted")
          dispatch(
            showNotification({
              message: "Alert!",
              status: 1,
            })
          );
          Navigate("/app/leads");
        }
      } catch (error) {
        // handleError(error);
        console.log("error ", error);
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,
            status: 0,
          })
        );
      }
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const updateFormValue = ({ updateType, value }) => {
    setAccountObj({ ...accountObj, [updateType]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountObj({ ...accountObj, [name]: value });
  };

  return (
    <>
      <TitleCard title="Fill Lead Details" topMargin="mt-2">
        <form onSubmit={(e) => submitForm(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              defaultValue={accountObj.name}
              updateType="name"
              containerStyle="mt-4"
              labelTitle="Name"
              updateFormValue={updateFormValue}
            />

            <InputText
              defaultValue={accountObj.email}
              updateType="email"
              containerStyle="mt-4"
              labelTitle="Email Id"
              updateFormValue={updateFormValue}
            />
            <InputText
              defaultValue={accountObj.contact}
              type="number"
              updateType="contact"
              containerStyle="mt-4"
              labelTitle="Number"
              updateFormValue={updateFormValue}
            />

            <div>
              <label className="label mt-4">Product</label>
              <select
                name="product"
                updateType="product"
                className="input input-bordered w-full pe-2"
                onChange={handleInputChange}
                value={accountObj.product}
              >
                <option value="default" selected disabled>
                  Select Product
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary float-right" type="submit">
              Submit
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
}

export default Leads;
