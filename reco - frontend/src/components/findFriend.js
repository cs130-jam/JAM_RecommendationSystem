import React, {useState, useRef} from 'react';
import ReactDOM from 'react-dom';


const FindFriend = () => {
    const [buttonText, setButtonText] = useState("Send Request"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState

    return (
        <div>
            <h2 className="text-center">Suggestions</h2>
            <div className = "row">
                <table className = "table">

                    
                    <tbody>
                    <tr>
                            <th>Edmund</th>
                            <th><button onClick={() => setButtonText("Request Sent")}>{buttonText}</button></th>
                            

                    </tr>
                    
                    </tbody>


                </table>


            </div>
        </div>
    );
  };

export default FindFriend;


