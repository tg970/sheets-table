/*eslint-disable*/
import React, { useEffect, useState }  from "react";

import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import network from "utils/network.js";

const testSheet = "1O3Xbi2UiwvBY91tlYUpR78-4r9rMFZjFF3E1JTnIowY"

const prodSheet = "15xYUaZiqCuEl2luDf2sa-omWfCEFUvLzL7cXwU2Cn5s"

const staticUrl = (sheetId) => {
  return `https://spreadsheets.google.com/feeds/cells/${sheetId}/1/public/values?alt=json`
}

function TableExample({...props}){
  const { classes, ...rest } = props;

  const [state, setState] = useState({
    loaded: false,
    columns: [],
    data: []
  })

  const dataProcessor = (data) => {
    // console.log(data);

    const entries = data.feed.entry

    // console.log(entries);

    const jsonTemplate = {}

    for (let i = 0;i < entries.length; i++) {

      if (entries[i].gs$cell.row === "1") {
        jsonTemplate[entries[i].gs$cell.col] = entries[i].content.$t;
      } else {
        break
      }

    }

    // console.log(jsonTemplate);

    let newCols = [];

    for (let key in jsonTemplate) {
      newCols.push({
        title: jsonTemplate[key], field: key
      })
    }

    // console.log(newCols);

    const simpleJson = entries.reduce((acc, cell, ind) => {
      if (cell.gs$cell.row == "1") {

        return acc

      } else if (cell.gs$cell.row == acc.row) {

        acc.temp[cell.gs$cell.col] = cell.content.$t;

      } else {

        acc.arr.push({
          ...acc.temp
        });

        acc.temp = {
          [cell.gs$cell.col]: cell.content.$t
        };
        acc.row = cell.gs$cell.row;

      }

      if (ind == entries.length - 1) {
        acc.arr.push({
          ...acc.temp
        });
      }

      return acc
    }, { arr: [], row: "2", temp: {} })

    // console.log(simpleJson);

    setState({
      loaded: true,
      columns: newCols,
      data: simpleJson.arr,
    })

  }

  useEffect(() => {
    if (!state.loaded) network.get(staticUrl(prodSheet), dataProcessor)
  });

  return (
    <div
      className={classes.innerWrap}
    >
      <MaterialTable
        isLoading={!state.loaded}
        title="רשימת חנויות"
        columns={state.columns || []}
        data={state.data || []}
        localization={{
          toolbar: {
            searchPlaceholder: "חיפוש",
            searchTooltip: "חיפוש",
          },
          pagination: {
            labelDisplayedRows: "{count} מתוך {to}-{from}",
            labelRowsSelect: "שורות",
            labelRowsPerPage: "שורות לעמוד:",
            firstAriaLabel: "עמוד ראשון",
            firstTooltip: "עמוד ראשון",
            previousAriaLabel: "עמוד קודם",
            previousTooltip: "עמוד קודם",
            nextAriaLabel: "עמוד הבא",
            nextTooltip: "עמוד הבא",
            lastAriaLabel: "עמוד אחרון",
            lastTooltip: "עמוד אחרון"
          }
        }}
        options={{
          pageSize: 100,
          pageSizeOptions: [10,20,100,500],
          padding: 'dense',
          headerStyle: {
            backgroundColor: "#97C7D3",
            color: '#FFF',
            textAlign: 'right',
            flexDirection: "row-reverse",
          },
          cellStyle: {
            textAlign: 'right',
          },
        }}
      />
    </div>
  );
}

const styles = {
  innerWrap: {
    // maxHeight: '90vh',
    overflow: 'auto',
    "& .MuiToolbar-root": {
      flexDirection: "row-reverse",
    },
    "& h6": {
      paddingRight: "7px",
    },
    "& .MuiInput-underline:after" : {
      borderBottom: '2px solid #97C7D3',
    }
  }
}


TableExample.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(TableExample);
