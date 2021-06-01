import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import CountUp from 'react-countup';
import './InfoBox.css';
// title : 
// cases:  no. of cases
// total: total no. of cases

const mapColor = new Map([
    ['cases', "#CC1034"],
    ['recovered', "#7DD71D"],
    ['deaths', "#fb4443"]

]);


function InfoBox({ title, cases, caseType, isRed, active, total, ...props }) {
    let styles = {
        border: `${active ? '5px solid ' + mapColor.get(caseType) : ''}`
    }
    console.log(caseType);
    // console.log(`${'10px solid ' + mapColor[caseType]}`);
    return (

        <Card onClick={props.onClick} className={`infoBox ${isRed && "infoBox--red"}`}
            style={styles} >
            < CardContent >
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                <Typography variant="h5" className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
                >+
                    {cases > 0 ? <CountUp start={0} end={cases} duration={3} seperator="," /> : cases}
                </Typography>

                <Typography variant="h6" className="infoBox__total">
                    {total > 0 ? <CountUp start={0} end={total} duration={3} seperator="," /> : total} Total
                </Typography>

            </ CardContent>
        </Card >
    )
}

export default InfoBox
