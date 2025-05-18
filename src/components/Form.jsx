import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { List, ListItem } from "@material-tailwind/react";
import { useState } from "react";

import "./Form.css";

export function SimpleRegistrationForm() {
  const [formData, setFormData] = useState({
    loanAmount: "",
    tenure: "",
    rateOfInterest: "",
    partPaymentAmount: 0,
  });

  const [paymentDetails, setPaymentDetails] = useState({
    monthlyEmi: "",
    fullPayment: "",
    fullInterest: "",
    actualPayment: "",
    actualInterest: "",
    partPaymentAmount: ""

  });

  const [schedule, setSchedule] = useState();
  const [partPaymentDetails, setPartPaymentDetails] = useState();

  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e, key) => {
    let value = parseFloat(e.target.value);
    console.log({ Value: value });
    let temp = {
      ...formData,
      [key]: value,
    };
    setFormData({
      ...formData,
      [key]: value,
    });
    let result = checkValidity(
      temp.loanAmount,
      temp.rateOfInterest,
      temp.tenure
    );
  };

  const onFormSubmit = () => {
    const temp = formData;
    const emi = calculateEMI(temp.loanAmount, temp.rateOfInterest, temp.tenure);
    const totalPayment = emi * temp.tenure * 12;
    const totalInterest = totalPayment - temp.loanAmount;
  
    let partPayments = [];
    for (let i = 0; i < temp.tenure * 12; i++) {
      partPayments.push(temp.partPaymentAmount);
    }
    setPartPaymentDetails(partPayments);
    const schedule = generateAmortizationSchedule(
      temp.loanAmount,
      temp.rateOfInterest,
      emi,
      partPayments
    );
    setSchedule(schedule);

    let actualInterest = 0;
    let actualPayment = 0;
    let partPaymentAmount = 0;
    for(let i=0;i<schedule.length;i++) {
      actualInterest = actualInterest+schedule[i].interestPaid;
      actualPayment+=schedule[i].emi+schedule[i].partPayment;
      partPaymentAmount+=schedule[i].partPayment;
    }
    setPaymentDetails({
      monthlyEmi: emi,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      actualInterest: actualInterest,
      actualPayment: actualPayment,
      partPaymentAmount: partPaymentAmount
    });
    console.log({ Schedule: schedule });
  };

  const onPartPaymentDetailsChange = (index, amount) => {
    let temp = partPaymentDetails;
    temp[index] = amount;
    setPartPaymentDetails(temp);
    const schedule = generateAmortizationSchedule(
      formData.loanAmount,
      formData.rateOfInterest,
      paymentDetails.monthlyEmi,
      temp
    );
    setSchedule(schedule);
    let actualInterest = 0;
    let actualPayment = 0;
    let partPaymentAmount = 0;
    for(let i=0;i<schedule.length;i++) {
      actualInterest = actualInterest+schedule[i].interestPaid;
      actualPayment+=schedule[i].emi+schedule[i].partPayment;
      partPaymentAmount+=schedule[i].partPayment;
    }
    setPaymentDetails({
      ...paymentDetails,
      actualInterest: actualInterest,
      actualPayment: actualPayment,
      partPaymentAmount: partPaymentAmount
    });
  };

  function generateAmortizationSchedule(
    principal,
    annualRate,
    emi,
    partPayments = []
  ) {
    const monthlyRate = annualRate / 12 / 100;
    let balance = principal;
    let schedule = [];
    let month = 1;

    while (balance > 0) {
      const interestPaid = balance * monthlyRate;
      let principalPaid = emi - interestPaid;

      const currentPartPayment = partPayments[month - 1] || 0;
      let totalPrincipalReduction = principalPaid + currentPartPayment;

      if (totalPrincipalReduction > balance) {
        totalPrincipalReduction = balance;
        principalPaid = Math.max(0, balance - currentPartPayment);
      }

      balance -= totalPrincipalReduction;

      schedule.push({
        month,
        emi: parseFloat(emi.toFixed(2)),

        principalPaid: parseFloat(principalPaid.toFixed(2)),
        interestPaid: parseFloat(interestPaid.toFixed(2)),
        partPayment: parseFloat(currentPartPayment.toFixed(2)),
        remainingPrincipal: parseFloat(Math.max(balance, 0).toFixed(2)),
        totalPrincipalReduction: parseFloat(totalPrincipalReduction.toFixed(2)),
      });

      month++;
    }

    return schedule;
  }

  function calculateEMI(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / 12 / 100;
    const tenureMonths = tenureYears * 12;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return parseFloat(emi.toFixed(2)); // Rounds to 2 decimal places
  }

  const checkValidity = (loanAmount, rateOfInterest, tenure) => {
    setIsFormValid(
      loanAmount > 0 && rateOfInterest > 0 && tenure > 0 && tenure <= 30
    );
    return loanAmount > 0 && rateOfInterest > 0 && tenure > 0 && tenure <= 30;
  };

  const TABLE_HEAD = [
    "Month",
    "EMI",
    "Towards Principal",
    "Towards Interest",
    "Part Payment",
    "Remaining Amount",
  ];

  function formatIndianRupee(amount) {
    // Convert to string and handle decimal parts
    let [integerPart, decimalPart] = String(amount).split('.');
    
    // Format the integer part with Indian comma conventions
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);
    
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    
    let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    
    // Add decimal part if exists
    if (decimalPart) {
      formatted += '.' + decimalPart;
    }
    
    return formatted;
  }

  return (
    <div>
      <div className="loan-app">
        <div className="form-data">
          <div className="w-96">
            <Input
              type="number"
              inputMode="numeric"
              label="Enter Loan amount"
              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onChange={(e) => handleChange(e, "loanAmount")}
            />
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              Enter the full loan amount
            </Typography>
          </div>

          <div className="w-96 pt-5">
            <Input
              type="number"
              inputMode="numeric"
              label="Enter the tenure in Years"
              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onChange={(e) => handleChange(e, "tenure")}
              max={30}
            />
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              Maxiumum tenure is 30 years
            </Typography>
          </div>

          <div className="w-96 pt-5">
            <Input
              type="number"
              inputMode="numeric"
              label="Enter the rate of interes"
              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min={0}
              onChange={(e) => handleChange(e, "rateOfInterest")}
            />
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              Minimum interest rate is 0%
            </Typography>
          </div>

          <div className="w-96 pt-5">
            <Input
              type="number"
              inputMode="numeric"
              label="Enter Part Payment Amount"
              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onChange={(e) => handleChange(e, "partPaymentAmount")}
            />
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              Enter the monthly part payment
            </Typography>
          </div>
          <div className="pt-5">
            <Button
              disabled={!isFormValid}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={onFormSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="payment-details">
          <Card className="w-96">
            <List>
              <ListItem>Monthly EMI : {formatIndianRupee(paymentDetails.monthlyEmi)}</ListItem>
              <ListItem>Toal Amount Paid (No Part Payment) : {formatIndianRupee(paymentDetails.totalPayment)}</ListItem>
              <ListItem>
                Total Interest Paid (No Part Payment): {formatIndianRupee(paymentDetails.totalInterest)}
              </ListItem>
              {paymentDetails.partPaymentAmount>0 && <div>
                <ListItem>
                Actual Amount Paid : {formatIndianRupee(paymentDetails.actualPayment)}
              </ListItem>

              <ListItem>
                Actual Interest Paid : {formatIndianRupee(paymentDetails.actualInterest)}
              </ListItem>
              <ListItem>
                You saved {formatIndianRupee(paymentDetails.totalInterest - paymentDetails.actualInterest)} by paying {formatIndianRupee(paymentDetails.partPaymentAmount)}
              </ListItem>
                </div>}
              
            </List>
          </Card>
        </div>
      </div>
      {schedule && (
        <div className="part-payments">
          <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule?.map(
                  (
                    {
                      month,
                      emi,
                      principalPaid,
                      interestPaid,
                      partPayment,
                      remainingPrincipal,
                    },
                    index
                  ) => {
                    const isLast = index === schedule.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={month}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {month}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {emi}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {principalPaid}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {interestPaid}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={partPaymentDetails[index]}
                            onChange={(e) =>
                              onPartPaymentDetailsChange(
                                index,
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {remainingPrincipal}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
