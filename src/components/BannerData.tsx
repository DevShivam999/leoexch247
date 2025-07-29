import {  useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import instance from "../services/AxiosInstance";
import { success } from "../utils/Tp";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { fetchBanner } from "../api/fetchUserPermissions";

const BannerData = () => {
  const { data, loading, error } = useAppSelector(
    (p: RootState) => p.BannerStore
  );
  const dispatch=useAppDispatch()

  useEffect(() => {
    dispatch(fetchBanner())
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await instance.post("user/delete_banner", { id });
      success();
      dispatch(fetchBanner());
    } catch (err) {}
  };

  if (loading) {
    return <div className="text-center">Loading banners...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div>
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Homepage Banners</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Type</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((banner) => (
                    <tr key={banner._id}>
                      <td>
                        <LazyLoadImage
                          alt="Banner Image"
                          effect="blur"
                          width={300}
                          height={200}
                          src={banner.image}
                          style={{
                            width: "300px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>
                        <span>Homepage Banner</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(banner._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No banners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerData;
