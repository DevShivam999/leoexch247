import React, { useState, useCallback, useEffect } from "react";
import FilteredList from "../components/FilterList";
import { Link, useNavigate } from "react-router-dom";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { Tp } from "../utils/Tp";

const CreatePartner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [user,setUser]=useState<{username:string,_id:string,numeric_id:number,status:boolean,roles:string[]}[]|null>(null)
    const Api=async()=>{
      try {
        const {data}=await instance.get("/user/getpartnerList")
        setUser(data.data)
      } catch (error) {
        
              ErrorHandler({err:error,dispatch,navigation:navigate,pathname:location.pathname})
      }
    }
    useEffect(()=>{
      Api()
    },[])


    const handleUserAction=async(id:string,action:string)=>{
      await instance.post("user/status",{
        status:action,userId:id
      })
      await Api()
    }
    const Permission=useAppSelector((p:RootState)=>p.Permissions)

  const filterByUsername = useCallback(
    (partner: { username: string }) => {
      return partner.username.toLowerCase().includes(searchTerm.toLowerCase());
    },
    [searchTerm],
  );

  // Step 3: Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
   const exportPDF = async () => {
  if(user&&user.length>0){
      const { PdfFile } = await import("../utils/PdfFile");
      const data =user.map(p=>({username:p.username,status:p.status}))
    await PdfFile(data, "Partner List");
  }
  };

  const userInfo=useAppSelector((p:RootState)=>p.changeStore.user)
  return (
    <section className="main-content">
      <div className="create-partner-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Partner List</h1>
              <Link to={`${userInfo.roles[0]=="owner_admin"&&Permission.permissions?.addUser?"/add-partner":"/create-partner"}`} onClick={()=>userInfo.roles[0]!="owner_admin"&&!Permission.permissions?.addUser&&Tp("You don't have permission to create users")} className="button-teen">
                Add Account
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <button type="button" className="red-button" onClick={exportPDF}>
                <i className="far fa-file-pdf"></i> PDF
              </button>
            </div>

            <div className="col-6 mb-3">
              <div className="search-box">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search Username"
                  className="form-control"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table-two table">
              <thead>
                <tr>
                  <th>UserName</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <FilteredList
                  items={user||[]}
                  filterFunction={filterByUsername}
                  renderItem={(partner) => (
                  
                    <tr key={partner._id}>
                      <td>{partner.username}</td>
                      <td>
                      <button className={`btn btn-${partner.status?"primary":"warning"}`}onClick={()=>handleUserAction(partner._id,!partner.status?"1":"0")}>{partner.status?"Active":"InActive"}</button>
                      </td>
                    </tr>
                  )}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePartner;
