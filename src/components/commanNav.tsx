
import { Link } from 'react-router-dom'
import type { MenuItem } from '../types/vite-env'
import React from 'react'

const CommanNav = ({item,index,p}:{item:MenuItem,index:number,p:any}) => {
  return (
    <li
                           className="menu-item dropdown menu-dropbtn"
                           key={index}
                         >
                           {"dropdown" in item ? (
                             <>
                               <Link
                                 className="btn dropdown-toggle menu-link "
                                 to="#"
                                 role="button"
                                 data-bs-toggle="dropdown"
                                 aria-expanded="false"
                               > {item.label}
                               </Link>
                               <ul
                                 className="dropdown-menu"
                                 style={{ width: "max" }}
                               >
                                 {item?.dropdown &&
                                   item.dropdown.map((sub, idx) => (
                                    <React.Fragment key={sub.label}>
                                     {sub.label!="Site Panel"&&sub.label!="Id Request"&&sub.label!="Bonus"&&<li  key={idx}>
                                       <Link
                                         className="dropdown-item"
                                         to={
                                           sub.label == "Account's Statement" && p
                                             ? `/account-statement/${p}`
                                             : sub.path
                                         }
                                       >
                                         {sub.label}
                                       </Link>
                                     </li>}
                                    </React.Fragment>
                                   ))}
                               </ul>
                             </>
                           ) : (
                             <Link className="menu-link" to={item.path}>
                               {item.label}
                             </Link>
                           )}
                         </li>
  )
}

export default CommanNav
