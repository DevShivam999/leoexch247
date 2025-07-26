

const SearchCom = ({handleChange,type="UserName"}:{handleChange:(e:string)=>void,type:string}) => {
  return (
   <div className="col-md-2 mb-3">
                  <label className="lable-two">{type}</label>
                  <input
                    type="search"
                    className="form-control"
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={type}
                  />
                </div>
  )
}

export default SearchCom
