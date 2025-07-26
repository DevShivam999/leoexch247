

const TableHead = ({classname="",type}:{type:string,classname?:string}) => {
  return (
    <th className={classname}>
        {
            type
        }
    </th>
  )
}

export default TableHead
