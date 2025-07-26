import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ISportsSettingsFormInputs } from "../types/vite-env";

interface SportsSettingsModalProps {
  onSubmitSettings: (data: ISportsSettingsFormInputs) => void;
}

const SportsSettingsModal: React.FC<SportsSettingsModalProps> = ({
  onSubmitSettings,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ISportsSettingsFormInputs>({
    defaultValues: {
      cricketEnabled: false,
      soccerEnabled: false,
      tennisEnabled: false,
      casinoQtechEnabled: false,
      diamondCasinoEnabled: false,
      virtualCricketEnabled: false,
      ballByBallEnabled: false,
      transactionPassword: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {

    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<ISportsSettingsFormInputs> = (data) => {
    console.log("Form Data Submitted:", data);
    onSubmitSettings(data);
  };

  return (
    <div
      className="  modal-one "
      id="SportsSettingsModal"
      tabIndex={-1}
      aria-labelledby="SportsSettingsModalLabel"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="SportsSettingsModalLabel">
              Sports Settings
            </h1>
            <button
              type="button"
              className="modal-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Cricket</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input type="checkbox" {...register("cricketEnabled")} />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Soccer</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input type="checkbox" {...register("soccerEnabled")} />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Tennis</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input type="checkbox" {...register("tennisEnabled")} />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Casino [Qtech]</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input
                      type="checkbox"
                      {...register("casinoQtechEnabled")}
                    />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Diamond Casino</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input
                      type="checkbox"
                      {...register("diamondCasinoEnabled")}
                    />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Virtual Cricket</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input
                      type="checkbox"
                      {...register("virtualCricketEnabled")}
                    />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-6 mb-3 text-center">
                  <h5 className="ssmodal-heading">Ball by Ball</h5>
                </div>
                <div className="col-6 mb-3 text-center">
                  <label className="switch switch-onoff">
                    <input type="checkbox" {...register("ballByBallEnabled")} />
                    <div className="slider round"></div>
                  </label>
                </div>

                <div className="col-4 mb-3 text-center">
                  <label htmlFor="transactionPassword" className="form-label">
                    Transaction Password
                  </label>
                </div>
                <div className="col-8 mb-3">
                  <input
                    id="transactionPassword"
                    type="password"
                    className="mgray-input-box form-control text-end"
                    {...register("transactionPassword", {
                      required: "Transaction password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.transactionPassword && (
                    <p className="text-danger mt-1">
                      {errors.transactionPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn modal-back-btn"
                data-bs-dismiss="modal"
              >
                <i className="fas fa-undo"></i> Back
              </button>

              <button type="submit" className="btn modal-submit-btn">
                Submit <i className="fas fa-sign-in-alt"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 SportsSettingsModal;
