import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import axios from "axios";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TitleCard from "../../components/Cards/TitleCard";
import { Link } from "react-router-dom";
import { sliceLeadDeleted } from "./leadSlice";
import { API, API_TOKEN, getUserData, todayUTC } from "../../utils/constants";
import { openModal } from "../common/modalSlice";
function AllList() {
  let user = getUserData();
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [catgoryFilter, setCategoryFilter] = useState("name");
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  const todayDateString = todayUTC;
  useEffect(() => {
    const fetchData = async () => {
      // const params = {
      //   hrId: user?._id,
      // };
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let categoryURL = `${API}/leads`;
      const baseURL = categoryURL;
      try {
        const response = await axios.get(baseURL, config, API_TOKEN);
        if (response.status === 200) {
          setLeadData(response.data);
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        // handleError(error);
      }
      dispatch(sliceLeadDeleted(false));
    };

    fetchData();
  }, [leadDeleted, todayDateString, user?._id, dispatch]);

  const deleteCurrentLead = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this Account?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index: index,
        },
      })
    );
  };
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = leadData?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      lead?.product?.toLowerCase().includes(filterValue) ||
      lead?.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.contact?.toString().includes(filterValue)
    );
  });

  const handleSearch = async () => {
    try {
      let sanitizedFilterValue = filterValue;
      if (filterValue.trim() !== "") {
        sanitizedFilterValue = filterValue.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
      }
      const baseURL = `${API}/leads?${catgoryFilter}=${sanitizedFilterValue}`;
      const response = await axios.get(baseURL, API_TOKEN);
      setLeadData(response.data);
      // console.log(response.data);
    } catch (error) {
      // handleError(error);
    }
  };

  return (
    <>
 <div className="mb-4 flex items-center gap-3 flex-wrap">
        <select
          className="select select-bordered select-sm w-48   font-light"
          value={catgoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="contact">Phone Number</option>
          <option value="email">Email</option>
          <option value="product">Product</option>
        </select>
        <input
          type="text"
          placeholder="Filter by Name or Phone special"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered   w-full max-w-xs "
        />
        <button onClick={handleSearch} className="btn btn-sm btn-primary">
          Search
        </button>
      </div>

      <TitleCard
        title="All Leads"
        topMargin="mt-2"
      >
        {filteredLeads?.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Product</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads?.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td className="truncate" style={{ maxWidth: "7rem" }}>
                          {l?.name}
                        </td>
                        <td className="truncate" style={{ maxWidth: "7rem" }}>
                          {l?.email}
                        </td>
                        <td className="truncate" style={{ maxWidth: "7rem" }}>
                          {l?.contact}
                        </td>
                        <td className="truncate" style={{ maxWidth: "7rem" }}>
                          {l?.product}
                        </td>
                        <td>
                          <div className="flex item-center justify-around">
                            <button
                              className="btn btn-square btn-ghost"
                              onClick={() => deleteCurrentLead(l?._id)}
                            >
                              <TrashIcon className="w-5" />
                            </button>

                            <div className="flex gap-3 items-center justify-center">
                              <Link
                                className="btn btn-square btn-ghost"
                                to={`/app/edit/${l?._id}`}
                              >
                                {"Edit"}
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-5">
            {/* <Pagination
              defaultCurrent={page}
              locale={locale}
              total={teamMember?.count}
              pageSize={limit}
              onChange={handlePageChange}
              showPrevNextJumpers
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            /> */}
          </div>
          </>
        )}
      </TitleCard>
    </>
  );
}

export default AllList;
