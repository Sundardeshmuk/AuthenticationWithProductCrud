import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteLead, sliceLeadDeleted } from '../../leads/leadSlice'
import { showNotification } from '../headerSlice'
import { API, API_TOKEN } from '../../../utils/constants'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()

    const { message, type, _id, index} = extraObject


    const proceedWithYes = async() => {
        if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
            try {
              const storedToken = localStorage.getItem("accessToken");
      
              if (storedToken) {
                const accessToken = JSON.parse(storedToken).token;
      
                if (accessToken) {
                  
      
                  const response = await axios.delete(
                    `${API}/leads/${index}`,
                    API_TOKEN
                  );
      
                  dispatch(sliceLeadDeleted(true));
                  dispatch(
                    showNotification({
                      message: `${response.data.message}`,
                      status: 1,
                    })
                  );
                }
              } else {
                dispatch(
                  showNotification({ message: "Access token not found", status: 0 })
                );
              }
            } catch (error) {
            //   handleError(error);
              dispatch(
                showNotification({
                  message: `${error.response.data.message}`,
                  status: 0,
                })
              );
            }
          }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline   " onClick={() => closeModal()}>Cancel</button>

                <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody