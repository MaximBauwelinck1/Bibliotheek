import * as styles from '../css/passwordStrength.module.css';
import { useMemo } from 'react';
const min_lengte = 8;
const moet_lowerCase_bevatten = true;
const moet_upperCase_bevatten = true;
const moet_getallen_bevatten = true;
const moet_tekens_bevatten = true;

const berekenSterkte = (pwd) => {
  const lowercase = new RegExp(/[a-z]/);
  const uppercase = new RegExp(/[A-Z]/);
  const getallen = new RegExp(/[1-9]/);
  const tekens =  new RegExp(/[;*#@!$%^&*()_+={}\\[\]:;"'<>,.?/\\|`~]/);
  let sterkte = 0;
  if (pwd.length >= min_lengte) {
    sterkte += 20; 
  }
  if(moet_lowerCase_bevatten && lowercase.test(pwd)){
    sterkte += 20;
  }
  if(moet_upperCase_bevatten && uppercase.test(pwd)){
    sterkte += 20;
  }
  if(moet_getallen_bevatten && getallen.test(pwd)){
    sterkte += 20;
  }
  if(moet_tekens_bevatten && tekens.test(pwd)){
    sterkte += 20;
  }
  return sterkte;
};
export default function PasswordStrength({pwd}){
  const value = useMemo(() => berekenSterkte(pwd), [pwd]);
  console.log(value);
  let strengthClass = '';

  if (value <= 20) {
    strengthClass = styles.weak;
  } else if (value <= 40) {
    strengthClass = styles.fair;
  } else if (value <= 60) {
    strengthClass = styles.good;
  } else {
    strengthClass = styles.strong;
  }
  
  return (
    <div className={styles.container}>
      <div
        className={`${styles.bar} ${strengthClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}