var gMapPcu = []
var gAmpOption = []
var gPcu = []

var mappcu = 'https://script.google.com/macros/s/AKfycbxueue8PgSZ3Xd6kDtyZkVXWUisT5r9XeIL_ViwqQCB-jpY0ulk2NPIlnnyxDg9giZA/exec?action=getData'
const REPORT_DATA_URL = 'https://opendata.moph.go.th/api/report_data'
const REPORT_PROVINCE = '57'

// ลำดับตารางต้องตรงกับ index1 ถึง index10 ด้านล่าง
const REPORT_TABLES = [
  's_kpi_dental62', // หญิงมีครรภ์ตรวจ dental และขัดฟัน
  's_kpi_dental20', // 0-2 ปี ตรวจ dental
  's_kpi_dental21', // 0-2 ปี ฝึกแปรงฟัน
  's_kpi_dental25', // 3-5 ปี ทาฟลูออไรด์
  's_kpi_dental64', // 6-12 ปี sealant
  's_kpi_dental44', // 15-59 ปี รับบริการทันตกรรม
  's_kpi_dental33', // ผู้สูงอายุตรวจ dental
  's_kpi_dental51', // PMD ก่อนสูงอายุ
  's_kpi_dental52', // PMD สูงอายุ
  's_kpi_dental61'  // dental coc
]

const KPI_TITLES = [
  'OHSP ร้อยละหญิงตั้งครรภ์ได้รับการตรวจสุขภาพช่องปาก และขัดทำความสะอาดฟัน เฉพาะเขตรับผิดชอบ (คน) (ใช้แบบความครอบคลุม)',
  'OHSP ร้อยละเด็ก 0-2 ปี ได้รับการตรวจสุขภาพช่องปาก เฉพาะเขตรับผิดชอบ (คน) (ใช้แบบความครอบคลุม)',
  'OHSP ร้อยละเด็ก 0-2 ปี ผู้ปกครองได้รับการฝึกแปรงฟันแบบลงมือปฏิบัติ หรือได้รับการฝึกแปรงฟันแบบลงมือปฏิบัติและ plaque control นับรวมฝึกผู้ปกครองทำความสะอาดช่องปาก เฉพาะเขต',
  'OHSP ร้อยละเด็ก 3-5 ปี เคลือบ/ทาฟลูออไรด์เฉพาะที่ เฉพาะเขตรับผิดชอบ (คน) (ใช้แบบความครอบคลุม)',
  'OHSP ร้อยละเด็ก 6-12 ปี ได้รับการเคลือบหลุมร่องฟัน เฉพาะเขตรับผิดชอบ',
  'OHSP ร้อยละผู้มีอายุ 15-59 ปี ได้รับบริการทันตกรรม (คน) (ใช้แบบความครอบคลุม)',
  '17.23 ร้อยละผู้สูงอายุได้รับการตรวจช่องปาก เฉพาะเขตรับผิดชอบ (คน) (ใช้แบบความครอบคลุม)',
  'ร้อยละประชากรก่อนวัยสูงอายุได้รับการตรวจคัดกรองรอยโรคเสี่ยงและรอยโรคก่อนมะเร็งในช่องปาก (PMD)',
  'ร้อยละผู้สูงอายุได้รับการตรวจคัดกรองรอยโรคเสี่ยงและรอยโรคก่อนมะเร็งในช่องปาก (PMD)',
  '17.26 ร้อยละผู้สูงอายุที่ติดบ้าน ติดเตียงได้รับการตรวจช่องปาก'
]

var loadedDataCount = 0

var index1,index2,index3,index4,index5,index6,index7,index8,index9,index10
var lastBudyear = ""

function extractReportRows(payload) {
  if (Array.isArray(payload)) return payload

  // รองรับกรณี API ส่ง JSON ที่ encode เป็น string อีกชั้น
  if (typeof payload === 'string') {
    try {
      return extractReportRows(JSON.parse(payload))
    } catch (_) {
      return null
    }
  }

  // รองรับข้อมูลที่ห่ออยู่ใน data, result, rows หรือ records
  if (payload && typeof payload === 'object') {
    for (const key of ['data', 'result', 'rows', 'records']) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const rows = extractReportRows(payload[key])
        if (rows !== null) return rows
      }
    }
  }

  return null
}

async function fetchAPI(tableName, budyear) {
  const maxAttempts = 3

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(REPORT_DATA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tableName: tableName,
        year: String(budyear),
        province: REPORT_PROVINCE,
        type: 'json'
      })
    })

    const responseText = await response.text()
    let payload

    try {
      payload = JSON.parse(responseText)
    } catch (_) {
      payload = responseText
    }

    // เรียกใหม่เฉพาะเมื่อ API ตอบ 429 หรือ server error
    // ถ้าเรียกสำเร็จจะไม่มีการหน่วงเวลาระหว่าง API
    if (
      (response.status === 429 || response.status >= 500) &&
      attempt < maxAttempts - 1
    ) {
      const retryAfterSeconds = Number(response.headers.get('Retry-After'))
      const waitMs = retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : 1000 * (attempt + 1)

      console.warn(
        `${tableName}: HTTP ${response.status}; retrying after ${waitMs} ms`
      )

      await new Promise(resolve => setTimeout(resolve, waitMs))
      continue
    }

    if (!response.ok) {
      throw new Error(
        `${tableName}: HTTP ${response.status} — ${responseText.slice(0, 500)}`
      )
    }

    const rows = extractReportRows(payload)

    if (rows === null) {
      console.error(`Unexpected MOPH response for ${tableName}:`, payload)

      throw new Error(
        `${tableName}: ไม่พบรายการข้อมูลใน response — ` +
        `${JSON.stringify(payload).slice(0, 700)}`
      )
    }

    // API รับ province=57 อยู่แล้ว แต่กรองซ้ำให้เหลือเฉพาะจังหวัดนี้
    return rows.filter(row =>
      String(row.areacode || '').substring(0, 2) === REPORT_PROVINCE
    )
  }
}

async function fetchMissingReportData(budyear, cachedData) {
  const results = cachedData.slice()

  const pending = REPORT_TABLES
    .map((tableName, index) => ({ tableName, index }))
    .filter(item => typeof results[item.index] === 'undefined')

  // เรียกทีละ API ตามลำดับ โดยไม่เว้นช่วงเวลาหลังเรียกสำเร็จ
  for (const item of pending) {
    results[item.index] = await fetchAPI(item.tableName, budyear)

    loadedDataCount++

    Swal.update({
      title: `กำลังโหลดข้อมูล โปรดรอ... ${loadedDataCount}/${pending.length}`
    })
  }

  return results
}

async function loadReportData(budyear) {
  [
    index1,
    index2,
    index3,
    index4,
    index5,
    index6,
    index7,
    index8,
    index9,
    index10
  ] = await fetchMissingReportData(
    budyear,
    [
      index1,
      index2,
      index3,
      index4,
      index5,
      index6,
      index7,
      index8,
      index9,
      index10
    ]
  )
}

function beforeLoad() {
  const budyear = $('#budyear').val()
  const ampur = $('#ampur').val()

  if (budyear != null && lastBudyear !== budyear) {
    index1 = undefined
    index2 = undefined
    index3 = undefined
    index4 = undefined
    index5 = undefined
    index6 = undefined
    index7 = undefined
    index8 = undefined
    index9 = undefined
    index10 = undefined
  }

  if (budyear == null || ampur == null) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'โปรดเลือกข้อมูลให้ครบ!',
      showConfirmButton: false,
      timer: 2000
    })
  } else {
    loadTable()
  }
}

async function loadTable() {
  Swal.fire({ title: 'กำลังโหลดข้อมูล โปรดรอ...' })
  Swal.showLoading()

  showSpin3()
  $('#hdc_table').html('')
  document.getElementById('btn1').disabled = true

  loadedDataCount = 0

  const budyear = $('#budyear').val()
  const ampur = $('#ampur').val()

  gPcu = gMapPcu
    .filter(r => r['ampcode'] == ampur)
    .map(r => r['pcu'])

  try {
    await loadReportData(budyear)

    const ampfil1 = index1.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash1 = groupDataPcu(gPcu, ampfil1)

    const ampfil2 = index2.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash2 = groupDataPcu(gPcu, ampfil2)

    const ampfil3 = index3.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash3 = groupDataPcu(gPcu, ampfil3)

    const ampfil4 = index4.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash4 = groupDataPcu(gPcu, ampfil4)

    const ampfil5 = index5.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash5 = groupDataPcu(gPcu, ampfil5)

    const ampfil6 = index6.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash6 = groupDataPcu(gPcu, ampfil6)

    const ampfil7 = index7.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash7 = groupDataPcu(gPcu, ampfil7)

    const ampfil8 = index8.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash8 = groupDataPcuPmds(gPcu, ampfil8)

    const ampfil9 = index9.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash9 = groupDataPcuPmds(gPcu, ampfil9)

    const ampfil10 = index10.filter(
      r => r['areacode'].substring(0, 4) == ampur
    )
    const dash10 = groupDataPcuCoc(gPcu, ampfil10)

    let newArr = []

    dash1.forEach(r => {
      let re2 = dash2.filter(f => f[0] === r[0]).length > 0
        ? dash2.filter(f => f[0] === r[0])[0][3]
        : 0

      let re3 = dash3.filter(f => f[0] === r[0]).length > 0
        ? dash3.filter(f => f[0] === r[0])[0][3]
        : 0

      let re4 = dash4.filter(f => f[0] === r[0]).length > 0
        ? dash4.filter(f => f[0] === r[0])[0][3]
        : 0

      let re5 = dash5.filter(f => f[0] === r[0]).length > 0
        ? dash5.filter(f => f[0] === r[0])[0][3]
        : 0

      let re6 = dash6.filter(f => f[0] === r[0]).length > 0
        ? dash6.filter(f => f[0] === r[0])[0][3]
        : 0

      let re7 = dash7.filter(f => f[0] === r[0]).length > 0
        ? dash7.filter(f => f[0] === r[0])[0][3]
        : 0

      let re8 = dash8.filter(f => f[0] === r[0]).length > 0
        ? dash8.filter(f => f[0] === r[0])[0][3]
        : 0

      let re9 = dash9.filter(f => f[0] === r[0]).length > 0
        ? dash9.filter(f => f[0] === r[0])[0][3]
        : 0

      newArr.push([
        r[0],
        r[3],
        re2,
        re3,
        re4,
        re5,
        re6,
        re7,
        re8,
        re9
      ])
    })

    genTable(newArr)
    genTableCoc(dash10)

    lastBudyear = budyear

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'โหลดข้อมูลสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    })

    console.log('loading end')
  } catch (error) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'การเชื่อมต่อผิดพลาด!',
      text: error.message,
      showConfirmButton: true
    })

    console.error('Error loading report data:', error)
  } finally {
    hideSpin3()
    hideSpin4()
    document.getElementById('btn1').disabled = false
    document.getElementById('btn2').disabled = false
  }
}

function genTable(arr) {
  let result = `<table class="table table-bordered" id="mainTable1">
    <thead>
      <th>PCU</th>
      <th class="dt-center"><div type="button" onclick="popS1()">S1(55%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS2()">S2(50%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS3()">S3(50%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS4()">S4(50%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS5()">S5(30%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS6()">S6(25%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS7()">S7(40%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS8()">S8(40%)</div></th>
      <th class="dt-center"><div type="button" onclick="popS9()">S9(40%)</div></th>
    </thead>
    `

  arr.forEach(r => {
    let color1 = swColor(55, r[1])
    let color2 = swColor(50, r[2])
    let color3 = swColor(50, r[3])
    let color4 = swColor(50, r[4])
    let color5 = swColor(30, r[5])
    let color6 = swColor(25, r[6])
    let color7 = swColor(40, r[7])
    let color8 = swColor(40, r[8])
    let color9 = swColor(40, r[9])

    result += `<tr>
      <td>${r[0]}</td>
      <td class="dt-center" style="color:${color1}">${r[1]}</td>
      <td class="dt-center" style="color:${color2}">${r[2]}</td>
      <td class="dt-center" style="color:${color3}">${r[3]}</td>
      <td class="dt-center" style="color:${color4}">${r[4]}</td>
      <td class="dt-center" style="color:${color5}">${r[5]}</td>
      <td class="dt-center" style="color:${color6}">${r[6]}</td>
      <td class="dt-center" style="color:${color7}">${r[7]}</td>
      <td class="dt-center" style="color:${color8}">${r[8]}</td>
      <td class="dt-center" style="color:${color9}">${r[9]}</td>
    </tr>`
  })

  result += '</table>'
  $('#hdc_table').html(result)
}

function genTableCoc(arr) {
  let result = `
    <h5>17.26 ร้อยละผู้สูงอายุ ที่ติดบ้าน ติดเตียงได้รับการตรวจช่องปาก (ร้อยละ 40)</h5>
    <table class="table table-bordered" id="mainTable2">
      <thead>
        <th>PCU</th>
        <th class="dt-center"><div>ติดบ้านและติดเตียง</div></th>
        <th class="dt-center"><div>ติดบ้าน</div></th>
        <th class="dt-center"><div>ติดเตียง</div></th>
      </thead>`

  arr.forEach(r => {
    let color1 = swColor(40, r[3])
    let color2 = swColor(40, r[6])
    let color3 = swColor(40, r[9])

    result += `<tr>
      <td>${r[0]}</td>
      <td class="dt-center" style="color:${color1}">${r[3]}</td>
      <td class="dt-center" style="color:${color2}">${r[6]}</td>
      <td class="dt-center" style="color:${color3}">${r[9]}</td>
    </tr>`
  })

  result += '</table>'
  $('#coc_table').html(result)
}

function groupDataPcu(pcu, amFilter) {
  let arr = []

  let pcuAllTarget = amFilter
    .map(m => m['target'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pcuAllResult = amFilter
    .map(m => m['result'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pucAllPercent = isNaN(pcuAllResult / pcuAllTarget)
    ? 0
    : Number(((pcuAllResult / pcuAllTarget) * 100).toFixed(2))

  pcu.forEach(r => {
    let pcufil = amFilter.filter(f => r.substring(0, 5) == f['hospcode'])

    if (pcufil.length > 0) {
      let target = pcufil
        .map(m => m['target'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let result = pcufil
        .map(m => m['result'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let percent = isNaN(result / target)
        ? 0
        : Number(((result / target) * 100).toFixed(2))

      arr.push([r, target, result, percent])
    } else {
      arr.push([r, 0, 0, 0.00])
    }
  })

  arr.push(['รวม', pcuAllTarget, pcuAllResult, pucAllPercent])
  return arr
}

function groupDataPcuPmds(pcu, amFilter) {
  let arr = []

  let pcuAllTarget = amFilter
    .map(m => m['target'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pcuAllResult = amFilter
    .map(m => m['result1'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pucAllPercent = isNaN(pcuAllResult / pcuAllTarget)
    ? 0
    : Number(((pcuAllResult / pcuAllTarget) * 100).toFixed(2))

  pcu.forEach(r => {
    let pcufil = amFilter.filter(f => r.substring(0, 5) == f['hospcode'])

    if (pcufil.length > 0) {
      let target = pcufil
        .map(m => m['target'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let result = pcufil
        .map(m => m['result1'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let percent = isNaN(result / target)
        ? 0
        : Number(((result / target) * 100).toFixed(2))

      arr.push([r, target, result, percent])
    } else {
      arr.push([r, 0, 0, 0.00])
    }
  })

  arr.push(['รวม', pcuAllTarget, pcuAllResult, pucAllPercent])
  return arr
}

function groupDataPcuCoc(pcu, amFilter) {
  let arr = []

  let pcuAllTarget1 = amFilter
    .map(m => m['target1'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pcuAllResult1 = amFilter
    .map(m => m['result1'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pucAllPercent1 = isNaN(pcuAllResult1 / pcuAllTarget1)
    ? 0
    : Number(((pcuAllResult1 / pcuAllTarget1) * 100).toFixed(2))

  let pcuAllTarget2 = amFilter
    .map(m => m['target2'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pcuAllResult2 = amFilter
    .map(m => m['result2'])
    .reduce((a, b) => Number(a) + Number(b), 0)

  let pucAllPercent2 = isNaN(pcuAllResult2 / pcuAllTarget2)
    ? 0
    : Number(((pcuAllResult2 / pcuAllTarget2) * 100).toFixed(2))

  let homeBedAllTarget = pcuAllTarget1 + pcuAllTarget2
  let homeBedAllResult = pcuAllResult1 + pcuAllResult2

  let homeBedAllPercent = isNaN(homeBedAllResult / homeBedAllTarget)
    ? 0
    : Number(((homeBedAllResult / homeBedAllTarget) * 100).toFixed(2))

  pcu.forEach(r => {
    let pcufil = amFilter.filter(f => r.substring(0, 5) == f['hospcode'])

    if (pcufil.length > 0) {
      let target1 = pcufil
        .map(m => m['target1'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let result1 = pcufil
        .map(m => m['result1'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let percent1 = isNaN(result1 / target1)
        ? 0
        : Number(((result1 / target1) * 100).toFixed(2))

      let target2 = pcufil
        .map(m => m['target2'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let result2 = pcufil
        .map(m => m['result2'])
        .reduce((a, b) => Number(a) + Number(b), 0)

      let percent2 = isNaN(result2 / target2)
        ? 0
        : Number(((result2 / target2) * 100).toFixed(2))

      let hbTarget = target1 + target2
      let hbResult = result1 + result2

      let hbPercent = isNaN(hbResult / hbTarget)
        ? 0
        : Number(((hbResult / hbTarget) * 100).toFixed(2))

      arr.push([
        r,
        hbTarget,
        hbResult,
        hbPercent,
        target1,
        result1,
        percent1,
        target2,
        result2,
        percent2
      ])
    } else {
      arr.push([r, 0, 0, 0.00, 0, 0, 0.00, 0, 0, 0.00])
    }
  })

  arr.push([
    'รวม',
    homeBedAllTarget,
    homeBedAllResult,
    homeBedAllPercent,
    pcuAllTarget1,
    pcuAllResult1,
    pucAllPercent1,
    pcuAllTarget2,
    pcuAllResult2,
    pucAllPercent2
  ])

  return arr
}

function loadPage() {
  loadingStart()
  console.log('load page start')

  fetch(mappcu)
    .then(response => response.json())
    .then(data => {
      gMapPcu = data['data']

      const option = gMapPcu.map(r => [r['ampcode'], r['ampur']])
      gAmpOption = normalize(option)

      let result = '<option disabled selected value="">เลือกอำเภอ</option>'

      gAmpOption.forEach(r => {
        result += `<option value="${r[0]}">${r[1]}</option>`
      })

      let result2 = ''

      gAmpOption.forEach(r => {
        result2 += `<option value="${r[0]}">${r[1]}</option>`
      })

      $('#ampur').html(result)
      $('#ampur_ch').html(result2)

      $(document).ready(function() {
        $('.multi_select').selectpicker()
      })

      loadingEnd()
      console.log('load page success')
    })
    .catch(error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'การเชื่อมต่อผิดพลาด!',
        showConfirmButton: false
      })

      loadingEnd()
      console.error('Error in fetch:', error.message)
    })
}

document.getElementById('navigation').addEventListener(
  'click',
  navClickEventHandler
)

document.getElementById('table-link').addEventListener(
  'click',
  showMainTable
)

document.getElementById('chart-link').addEventListener(
  'click',
  showMainChart
)

document.addEventListener('DOMContentLoaded', () => {
  loadPage()
  showMainTable()
})