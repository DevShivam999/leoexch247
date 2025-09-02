import { Link, useLocation } from "react-router-dom";
import type { navMenu } from "../utils/nav.services";
import React from "react";

const MiddNav = ({
  idx,
  item,
  p,
}: {
  idx: number;
  item: (typeof navMenu)[number];
  p: number;
}) => {
  const location = useLocation();
  return (
    <li className="left-bar-item accordion-item" key={idx}>
      {item.children ? (
        <>
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-item-btn collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${idx}`}
              aria-expanded="false"
              aria-controls={`collapse${idx}`}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </button>
          </h2>
          <div
            id={`collapse${idx}`}
            className="accordion-collapse collapse"
            data-bs-parent="#left-navbar"
          >
            <div className="accordion-body p-0">
              <ul className="accordion-inner-ul">
                {item.children.map((child, childIdx) => (
                  <React.Fragment key={child.label}>
                    {child.label != "Site Panel" &&
                      child.label != "Id Request" &&
                      child.label != "Bonus" && (
                        <li
                          key={childIdx}
                          className={`accordion-inner-item ${
                            location.pathname === child.to ? "active" : ""
                          }`}
                        >
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "0px",
                              width: "100%",
                            }}
                            disabled={child.label == "Site Panel"}
                          >
                            <Link
                              to={
                                child.label == "Account's Statement" && p
                                  ? `/account-statement/${p}`
                                  : child.to
                              }
                              className="accordion-inner-link"
                            >
                              {child.label}
                            </Link>
                          </button>
                        </li>
                      )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <Link
          to={item.to}
          className={`left-bar-link ${
            location.pathname === item.to ? "active" : ""
          }`}
        >
          <i className={`bi ${item.icon}`}></i> {item.label}
        </Link>
      )}
    </li>
  );
};

export default MiddNav;
