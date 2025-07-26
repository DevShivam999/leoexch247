const SearchBtn = ({Api,type="Load"}:{Api:()=>void,type:string}) => {
  return (
    <div className="col-md-2 mb-3">
      <button type="button" onClick={() => Api()} className="search-button">
       {type}
      </button>
    </div>
  );
};

export default SearchBtn;
