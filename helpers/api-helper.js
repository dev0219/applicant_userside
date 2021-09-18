class ApiHelper{
  getAPICommonData(clientDt) {
    let commondata = '<ACORD xmlns="http://www.ACORD.org/standards/PC_Surety/ACORD1/xml/Stillwater">\n' +
      '  <SignonRq>\n' +
      '    <SignonTransport>\n' +
      '      <SignonRoleCd>Agent</SignonRoleCd>\n' +
      '      <CustId>\n' +
      '        <SPName>com.CNG</SPName>\n' +
      '        <CustPermId>xmlcngtest</CustPermId>\n' +
      '        <CustLoginId>xmlcngtest</CustLoginId>\n' +
      '      </CustId>\n' +
      '    </SignonTransport> <!-- now -->\n' +
      '    <ClientDt>' + clientDt + '</ClientDt>\n' +
      '    <CustLangPref>ENG</CustLangPref>\n' +
      '    <ClientApp>\n' +
      '      <Org>Internet</Org>\n' +
      '      <Name>com.CNG</Name>\n' +
      '      <Version>1.0</Version>\n' +
      '    </ClientApp>\n' +
      '  </SignonRq>\n';
    return commondata;
  }
}

module.exports = ApiHelper;
