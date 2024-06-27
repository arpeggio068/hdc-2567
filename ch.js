  function beforeChart(){
    const budyear = $('#budyear').val();
    const ampur_ch = $('#ampur_ch').val(); 

    if(budyear != null && lastBudyear !== budyear){
      index1 = undefined; index2 = undefined; index3 = undefined; index4 = undefined; 
      index5 = undefined; index6 = undefined; index7 = undefined; index8 = undefined; 
      index9 = undefined; index10 = undefined;   
    } 

    if(budyear == null || ampur_ch == null){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "โปรดเลือกข้อมูลให้ครบ!",
        showConfirmButton: false,
        timer: 2000
      });
    }
    else if(ampur_ch.length < 2){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "โปรดเลือกอย่างน้อย 2 อำเภอ!",
        showConfirmButton: false,
        timer: 2000
      });
    }
    else{      
      groupDataAmpMain()
    }
  }
  
  async function groupDataAmpMain(){
    Swal.fire({ title: 'กำลังโหลดข้อมูล โปรดรอ...' });
    Swal.showLoading();
    showSpin4()  
    document.getElementById("btn2").disabled = true  
    const budyear = $('#budyear').val();
    const ampur_ch = $('#ampur_ch').val();
    index1 = typeof(index1) == 'undefined' ? await fetchAPI(url1 + budyear) : index1   
    index2 = typeof(index2) == 'undefined' ? await fetchAPI(url2 + budyear) : index2    
    index3 = typeof(index3) == 'undefined' ? await fetchAPI(url3 + budyear) : index3
    index4 = typeof(index4) == 'undefined' ? await fetchAPI(url4 + budyear) : index4
    index5 = typeof(index5) == 'undefined' ? await fetchAPI(url5 + budyear) : index5
    index6 = typeof(index6) == 'undefined' ? await fetchAPI(url6 + budyear) : index6
    index7 = typeof(index7) == 'undefined' ? await fetchAPI(url7 + budyear) : index7
    index8 = typeof(index8) == 'undefined' ? await fetchAPI(url8 + budyear) : index8 //pmd
    index9 = typeof(index9) == 'undefined' ? await fetchAPI(url9 + budyear) : index9 //pmd
    index10 = typeof(index10) == 'undefined' ? await fetchAPI(url10 + budyear) : index10 //coc
    let chArr = []
    ampur_ch.forEach(r => {       
        let ampPercent1 = ampArrFilterPercent(index1,'target','result',r)        
        let ampPercent2 = ampArrFilterPercent(index2,'target','result',r)   
        let ampPercent3 = ampArrFilterPercent(index3,'target','result',r) 
        let ampPercent4 = ampArrFilterPercent(index4,'target','result',r)   
        let ampPercent5 = ampArrFilterPercent(index5,'target','result',r)
        let ampPercent6 = ampArrFilterPercent(index6,'target','result',r)   
        let ampPercent7 = ampArrFilterPercent(index7,'target','result',r)   
        let ampPercent8 = ampArrFilterPercent(index8,'target','result1',r)    
        let ampPercent9 = ampArrFilterPercent(index9,'target','result1',r)  
        let ampPercent10 = ampArrFilterPercentCoc(index10,r)    
        let rec = {}
        rec['ampur'] = gAmpOption.filter(f=> f[0] == r).map(m=>m[1])[0]
        rec['S1'] = ampPercent1
        rec['S2'] = ampPercent2
        rec['S3'] = ampPercent3
        rec['S4'] = ampPercent4
        rec['S5'] = ampPercent5
        rec['S6'] = ampPercent6
        rec['S7'] = ampPercent7
        rec['S8'] = ampPercent8
        rec['S9'] = ampPercent9
        rec['S10'] = ampPercent10
        chArr.push(rec)
    });
    //console.log(chArr) 
    await renderChart(chArr) 
    lastBudyear = budyear
    if (typeof(index1) != 'undefined' && typeof(index2) != 'undefined' && typeof(index3) != 'undefined' 
        && typeof(index4) != 'undefined' && typeof(index5) != 'undefined' && typeof(index6) != 'undefined' 
        && typeof(index7) != 'undefined' && typeof(index8) != 'undefined' && typeof(index9) != 'undefined' 
        && typeof(index10) != 'undefined') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "โหลดข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500
       });
       hideSpin4()
       document.getElementById("btn2").disabled = false
       console.log("loading end");
    }   
  }

  function ampArrFilterPercent(arr,strTarget,strResult,r){
    let ampfil = arr.filter(f=> f['areacode'].substring(0, 4) == r) 
    let ampTarget = ampfil.map(m => m[`${strTarget}`]).reduce((a, b) => Number(a) + Number(b), 0) 
    let ampResult = ampfil.map(m => m[`${strResult}`]).reduce((a, b) => Number(a) + Number(b), 0) 
    let ampPercent = isNaN(ampResult/ampTarget) ? 0 : Number(((ampResult/ampTarget)*100).toFixed(2))

    return ampPercent
  }

  function ampArrFilterPercentCoc(arr,r){
    let amFilter = arr.filter(f=> f['areacode'].substring(0, 4) == r) 
    let pcuAllTarget1 = amFilter.map(m => m['target1']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult1 = amFilter.map(m => m['result1']).reduce((a, b) => Number(a) + Number(b), 0) 
    //let pucAllPercent1 = isNaN(pcuAllResult1/pcuAllTarget1) ? 0 : Number(((pcuAllResult1/pcuAllTarget1)*100).toFixed(2))

    let pcuAllTarget2 = amFilter.map(m => m['target2']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult2 = amFilter.map(m => m['result2']).reduce((a, b) => Number(a) + Number(b), 0) 
    //let pucAllPercent2 = isNaN(pcuAllResult2/pcuAllTarget2) ? 0 : Number(((pcuAllResult2/pcuAllTarget2)*100).toFixed(2))

    let homeBedAllTarget = pcuAllTarget1 + pcuAllTarget2
    let homeBedAllResult = pcuAllResult1 + pcuAllResult2
    let homeBedAllPercent = isNaN(homeBedAllResult/homeBedAllTarget) ? 0 : Number(((homeBedAllResult/homeBedAllTarget)*100).toFixed(2))

    return homeBedAllPercent
     
  }  

   async function renderChart(data) {     
     $('#chart').html('')
      const fix_color = ['#26A0FC','#26E7A6','#FEBC3B','#FF6178','#8B75D7','#6D848E','#43B0A6',
        '#D830EB','#06D852','#D86F06','#10E7E4','#F33517','#BD6051','#904103','#99F905','#E7ABF7',
        '#A5A708','#F1F405'] 
    
      const series = data.map(function(r) {
        return {
          name: r['ampur'],
          data: [r['S1'], r['S2'], r['S3'], r['S4'], r['S5'], r['S6'], r['S7'], r['S8'], r['S9'], r['S10']]
        };
      });
    
      const categories = ['S1', 'S2', 'S3','S4', 'S5', 'S6','S7', 'S8', 'S9','S10'];
    
      const options = {
        series: series,
        chart: {
          height: 400,
          type: 'line',
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            }
          }
        },
        colors: fix_color,
        dataLabels: {
          enabled: false,
          formatter: function (val) {
            return val.toFixed(2) + " %";
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        xaxis: {
          categories: categories,
          position: 'bottom',
          labels: {
            style: {
              //colors: fix_color,
              fontSize: '12px'
            }
          },
          axisBorder: {
            show: true,
            color: '#000000',
            offsetX: 1,
           
          },
          axisTicks: {
            show: true,
            borderType: 'solid',  // Set the border type for the ticks
            color: '#000000',  // Set the color of the ticks
            width: 6,
            offsetX: 1,
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true
          }
        },
        yaxis: {
          min: 0,
          max: 100,
          axisBorder: {
            show: true,
            color: '#000000',  // Set the color of the axis line
            width: 1,  // Set the width of the axis line
            offsetX: 0,
            offsetY: 0
          },
          axisTicks: {
            show: true,
            borderType: 'solid',  // Set the border type for the ticks
            color: '#000000',  // Set the color of the ticks
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          labels: {
            show: true,
            formatter: function (val) {
              return val;
            }
          }
        },
        markers: {
            size: 2,
        }
      };
    
      const chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    }
  function showMainTable(){   
    $('#chBtnTable1').show()
    $('#tableEl1').show()
    $('#tableEl2').show()
    $('#hdc').show()
    $('#coc').show()
    $('#multiEl').hide()
    $('#showChart').hide()
    showHdcTable()
  }  
    
  function showMainChart(){   
    $('#chBtnTable1').hide() 
    $('#tableEl1').hide()
    $('#tableEl2').hide()
    $('#hdc').hide()
    $('#coc').hide()
    $('#multiEl').show() 
    $('#showChart').show()
  }  
    
  
