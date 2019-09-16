import React, { Component } from "react";
import Select from "react-select";
import { FormGroup, Label, Row, Col } from "reactstrap";

const cities = [
  { value: "", label: "--Select--" },
  { value: "Karachi", label: "Karachi" },
  { value: "Lahore", label: "Lahore" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  { value: "Multan", label: "Multan" },
  { value: "Gujranwala", label: "Gujranwala" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Peshawar", label: "Peshawar" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Quetta", label: "Quetta" },
  { value: "Sargodha", label: "Sargodha" },
  { value: "Sialkot", label: "Sialkot" },
  { value: "Bahawalpur", label: "Bahawalpur" },
  { value: "Sukkur", label: "Sukkur" },
  { value: "Kandhkot", label: "Kandhkot" },
  { value: "Sheikhupura", label: "Sheikhupura" },
  { value: "Mardan", label: "Mardan" },
  { value: "Gujrat", label: "Gujrat" },
  { value: "Larkana", label: "Larkana" },
  { value: "Kasur", label: "Kasur" },
  { value: "Rahim Yar Khan", label: "Rahim Yar Khan" },
  { value: "Sahiwal", label: "Sahiwal" },
  { value: "Okara", label: "Okara" },
  { value: "Wah Cantonment", label: "Wah Cantonment" },
  { value: "Dera Ghazi Khan", label: "Dera Ghazi Khan" },
  { value: "Mingora", label: "Mingora" },
  { value: "Mirpur Khas", label: "Mirpur Khas" },
  { value: "Chiniot", label: "Chiniot" },
  { value: "Nawabshah", label: "Nawabshah" },
  { value: "Kamoke", label: "Kamoke" },
  { value: "Burewala", label: "Burewala" },
  { value: "Jhelum", label: "Jhelum" },
  { value: "Sadiqabad", label: "Sadiqabad" },
  { value: "Khanewal", label: "Khanewal" },
  { value: "Hafizabad", label: "Hafizabad" },
  { value: "Kohat", label: "Kohat" },
  { value: "Jacobabad", label: "Jacobabad" },
  { value: "Shikarpur", label: "Shikarpur" },
  { value: "Muzaffargarh", label: "Muzaffargarh" },
  { value: "Khanpur", label: "Khanpur" },
  { value: "Gojra", label: "Gojra" },
  { value: "Bahawalnagar", label: "Bahawalnagar" },
  { value: "Abbottabad", label: "Abbottabad" },
  { value: "Muridke", label: "Muridke" },
  { value: "Pakpattan", label: "Pakpattan" },
  { value: "Khuzdar", label: "Khuzdar" },
  { value: "Jaranwala", label: "Jaranwala" },
  { value: "Chishtian", label: "Chishtian" },
  { value: "Daska", label: "Daska" },
  { value: "Mandi Bahauddin", label: "Mandi Bahauddin" },
  { value: "Ahmadpur East", label: "Ahmadpur East" },
  { value: "Kamalia", label: "Kamalia" },
  { value: "Tando Adam", label: "Tando Adam" },
  { value: "Khairpur", label: "Khairpur" },
  { value: "Dera Ismail Khan", label: "Dera Ismail Khan" },
  { value: "Vehari", label: "Vehari" },
  { value: "Nowshera", label: "Nowshera" },
  { value: "Dadu", label: "Dadu" },
  { value: "Wazirabad", label: "Wazirabad" },
  { value: "Khushab", label: "Khushab" },
  { value: "Charsada", label: "Charsada" },
  { value: "Swabi", label: "Swabi" },
  { value: "Chakwal", label: "Chakwal" },
  { value: "Mianwali", label: "Mianwali" },
  { value: "Tando Allahyar", label: "Tando Allahyar" },
  { value: "Kot Adu", label: "Kot Adu" },
  { value: "Farooka", label: "Farooka" },
  { value: "Chichawatni", label: "Chichawatni" },
  { value: "Vehari", label: "Vehari" },
  { value: "Khewra", label: "Khewra" },
  { value: "Other", label: "Other" }
]

class RenderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log(this.props.value)
  }

  state = {
    selectedOption: null
  };

  componentDidMount() {
    if(this.props.value){
      this.setState({selectedOption: this.props.value})
    }
  }

  handleChange = selectedOption => {
   if(selectedOption){
    this.setState({ selectedOption });
    this.props.form.setFieldValue(this.props.field.name, selectedOption.value);
   }else{
    this.setState({selectedOption: null})
    this.props.form.setFieldValue(this.props.field.name, '');
   }
  };

  render() {
    const { selectedOption } = this.state;
    const touched = this.props.form.touched;
    const field = this.props.field;
    const errors = this.props.form.errors;

    return (
      <React.Fragment> 
          <FormGroup>
            <Label>{this.props.label} {this.props.requiredStar &&<span className="text-danger">*</span>} {this.props.warningStar && <span className="text-warning">*</span>}</Label>
            <div>
              <Select
                value={selectedOption}
                onChange={this.handleChange}
                options={cities}
                defaultValue={this.props.value}
              />
              <p className="error text-danger">{touched[field.name] && errors[field.name] && errors[field.name]}</p>
            </div>
          </FormGroup>
      </React.Fragment>
    );
  }
}

export default RenderSelect;
