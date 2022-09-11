import React from 'react';
import styled, { css } from 'styled-components';
import Typewriter from 'typewriter-effect';
import { Typography, Input, CancelCircleSVG } from '@ensdomains/thorin';
import { Stack, Tooltip } from '@mui/material';
import NavBar from '../../components/NavBar';
import '../../global.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { create as uri } from '../../utils/uri';
import { create as contract } from '../../utils/contract';
import { Rave } from '@rave-names/rave';
import { truncateAddress } from '../../utils/addressManip';
import { Grid } from 'theme-ui';
import Swal from 'sweetalert2';

const addressKeys = {
  btc: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=022',
  eth: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022',
  avax: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022',
  bch: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=022',
  ftm: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=022',
  ltc: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=022',
  luna: 'https://cryptologos.cc/logos/terra-luna-luna-logo.svg?v=022',
  dot: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=022',
  xrp: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=022',
  bnb: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022',
  atom: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg?v=022',
}

interface Context {
  wallet: any;
  setWallet: any;
}

const prov = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools");

export const walletContext = React.createContext({
  wallet: prov,
  setWallet: undefined
} as Context);

const Wrapper = styled.div`
    margin-left: 2vh;
    margin-right: 2vh;
    border-radius: 17px;
    margin-top: 1vh;
    background-color: rgba(0,0,0,0.2);
    padding-bottom: 2vh;
    min-height: calc(100vh - 6vh - 10vh)
`;

const DetailsWrapper = styled.div`
    margin-left: 2vh;
    margin-right: 2vh;
    border-radius: 17px;
    margin-top: 1vh;
    background-color: rgba(0,0,0,0.2);
    padding-bottom: 2vh;
    min-width: calc(100vw - 4vh - 2vh - 2vh - 20vw - 4vh);
`;

const Header = styled.h1`
  padding-left: 4vh;
  ${props => `
    ${props.sub && `padding-top: 2vh;`}
  `}
`;

const ActionButton = styled.button`
    border-radius: 17px;
    height: calc(9.75vh);
    margin-top: 1.25vh;
    border: none;
    background-image: linear-gradient(330deg, #03045E, #0096C7);
    width: 20vw;
    cursor: pointer;
    margin-left: 2vh;
`;

const ActionButtonAgain = styled.button`
    border-radius: 12px;
    height: calc(4.75vh);
    border: none;
    background-image: linear-gradient(330deg, #03045E, #0096C7);
    ${props => `${ props.side ?
      `width: calc(20vw - 4vh);
       height: 9.5vh;` : 'width: 7.5vw;'
    }`}
    cursor: pointer;
    margin-left: 2vh;
`;

const MoreWrapper = styled.div`
  background-color: rgba(0,0,0,0.2);
  ${props => `
    width: ${props.width};
    height: ${props.height};
  `}
  margin-left: 6vh;
  border-radius: 17px;
`;

const MoreWrapperSideBar = styled.div`
  background-color: rgba(0,0,0,0.2);
  ${props => `
    width: ${props.width};
    height: ${props.height};
  `}
  margin-top: 2vh;
  margin-left: 2vh;
  border-radius: 17px;
`;

function App() {
  const [ searchInput, setSInput ] = React.useState('');
  const history = useNavigate();
  let { name } = useParams();
  // wallet really means signer or provider
  const [ wallet, setWallet ] = React.useState(prov);
  const [ src, sss ] = React.useState('https://rave.domains/RaveBase.png');
  const [ owned, so ] = React.useState(false);
  const [
    data,
    setData
  ] = React.useState({
    avatar: "https://rave.domains/RaveBase.png",
    addresses: {}
  });
  const [ owner, setOwner ] = React.useState();
  const [ isOwner, setIO ] = React.useState(false);

  React.useEffect(() => {
    const get = async () => {
      sss(JSON.parse(atob((await (uri(wallet)).generate(`${name}.ftm`)).split(';base64,')[1]))['image']);
      const none = (JSON.parse(atob((await (uri(wallet)).generate(`None Set`)).split(';base64,')[1]))['image']);
      so((await ((new Rave()).isOwned(`${name}.ftm`)))[0]);
      setOwner((await ((contract(wallet)).getOwner(`${name}.ftm`))))
      // @ts-ignore
      try { setIO((await wallet.getAddress()) === owner); } catch (e) { console.warn('no signer'); }
      const a = (await ((contract(wallet)).getAvatar(`${name}.ftm`)));
      const ad = (await ((contract(wallet)).getAddresses(`${name}.ftm`)));
      console.log(a.length, `{${ad}}`);
      setData({
        avatar:  (a.length > 0) ? (a) : none,
        addresses: JSON.parse((ad.length > 0) ? (ad) : "{}"),
      })
    }
    get();
  }, [wallet, name])

  return (
    <walletContext.Provider value={{
      wallet: wallet,
      setWallet: setWallet
    }}>
      <Stack style={{
        minHeight: '100vh'
      }}>
        <NavBar />
        <Wrapper id={`rave--name-${name}`}>
        <Stack direction="row">
            <Stack>
              <img src={src} style={{
                margin: '2vh 2vh',
                borderRadius: '17px',
                width: '20vw'
              }}/>
              <div>
                <ActionButton
                  onClick={(!owned) ? (() => {
                    (new Rave()).registerName(name, wallet, ethers.utils.parseEther('5'))
                  }) : (() => {
                    //
                  })}
                >
                  <p style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display', fontSize: `${owned ? '16px' : '22px'}` }}>{owned ? `${name}.ftm is owned` : `Register ${`${name}.ftm`}`}</p>
                </ActionButton>
              </div>
              <MoreWrapperSideBar width="20vw" height="12vw">
                <ul>
                  <br/>
                  {owned ? <a href={`https://ftmscan.com/address/${owner || "0x0"}`} style={{ textDecoration: 'none' }}><li style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display', fontSize: '18px', listStyleType: 'none' }}>Owned by {owner ? truncateAddress(owner) : 'N/A'}</li></a> : <li>{name} is not owned</li>}
                </ul>
                {isOwner && <ActionButtonAgain onClick={() => {Swal.fire({
                  title: `Transfer ${name}.ftm`,
                  html: `This will transfer ALL ownership of the name ${name}.ftm. Be careful with this.<br><br>Learn more at our <a href='https://docs.rave.domains'>docs</a>.`,
                  icon: 'info',
                  input: 'text',
                  inputAttributes: {
                    autoCapitalize: 'off'
                  },
                  showDenyButton: true,
                  showConfirmButton: true,
                  confirmButtonText: 'Set!',
                  denyButtonText: 'No thanks...'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    contract(wallet).safeTransferFrom(owner, result.value, name).catch((e) => {
                      console.error(e);
                    });
                  }
                });}} side><p style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display', fontSize: `22px` }}>Transfer</p></ActionButtonAgain>}
              </MoreWrapperSideBar>
            </Stack>
            <DetailsWrapper>
              <Header style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display' }}>{name}.ftm details</Header>
              <Stack direction="row">
                <MoreWrapper width="calc(20vw + 2vh)" height="28vw">
                  <Header style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display' }} sub>
                    Avatar <ActionButtonAgain onClick={() => {
                      Swal.fire({
                        title: `Set an avatar for ${name}.ftm`,
                        html: `You must enter a link, containing your avatar. <br><br>This link should be in .png or .jpg form.<br><br>Learn more at our <a href='https://docs.rave.domains/'>docs</a>.`,
                        icon: 'info',
                        input: 'text',
                        inputAttributes: {
                          autoCapitalize: 'off'
                        },
                        showDenyButton: true,
                        showConfirmButton: true,
                        confirmButtonText: 'Set!',
                        denyButtonText: 'No thanks...'
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          (contract(wallet)).setAvatar(`${name}.ftm`, result.value).catch((e) => {
                            console.error(e);
                          });
                        }
                      });
                    }} style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display', fontSize: '22px' }}>Set</ActionButtonAgain>
                  </Header>
                  <img src={data.avatar} style={{
                    margin: '0 2vh',
                    borderRadius: '17px',
                    width: '19vw'
                  }}/>
                </MoreWrapper>
                <MoreWrapper width="24.5vw" height="33vw">
                  <Header style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display' }} sub>
                    Addresses <ActionButtonAgain onClick={() => {
                      Swal.fire({
                        title: 'Set wallet addresses for different chains.',
                        confirmButtonText: 'Set!',
                        denyButtonText: 'No Thanks...',
                        showDenyButton: true,
                        showConfirmButton: true,
                        html:
                          '<p>Input your wallet addresses for different blockchains here, and have them stored on-chain! You can leave some fields blank. <br />' +
                          '<input id="btc" placeholder="Bitcoin" class="swal2-input">' +
                          '<input id="eth" placeholder="Ethereum" class="swal2-input">' +
                          '<input id="bch" placeholder="Bitcoin Cash" class="swal2-input">' +
                          '<input id="ltc" placeholder="Litecoin" class="swal2-input">' +
                          '<input id="xrp" placeholder="Ripple" class="swal2-input">' +
                          '<input id="avax" placeholder="Avalanche C-Chain" class="swal2-input">' +
                          '<input id="bnb" placeholder="BNB on BSC" class="swal2-input">' +
                          '<input id="luna" placeholder="Terra LUNA" class="swal2-input">' +
                          '<input id="near" placeholder="Near" class="swal2-input">' +
                          '<input id="atom" placeholder="Cosmos" class="swal2-input">',
                        preConfirm: function () {
                          return new Promise(function (resolve) {
                            resolve({
                              btc: $('#btc').val(),
                              eth: $('#eth').val(),
                              bch: $('#bch').val(),
                              ltc: $('#ltc').val(),
                              xrp: $('#xrp').val(),
                              avax: $('#avax').val(),
                              bnb: $('#bnb').val(),
                              luna: $('#luna').val(),
                              near: $('#near').val(),
                              atom: $('#atom').val(),
                            })
                          })
                        },
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          (contract(wallet)).setAddresses(`${name}.ftm`, JSON.stringify(result.value)).catch((e) => {
                            console.error(e);
                          });
                        }
                      })
                    }} style={{ color: '#0FFFF0', fontFamily: 'Red Hat Display', fontSize: '22px' }}>Set</ActionButtonAgain>
                  </Header>
                  <Grid gap={2} style={{
                    alignItems: "center",
                    alignSelf: "center",
                    textAlign: "center",
                    marginLeft: '2vh' }}>
                    {Object.entries(data.addresses).map( function (item, key) {
                      return <>{(item[1] !== "") && <Tooltip title={`Click to copy`}><button style={{
                        border: 'none',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#FFF',
                        cursor: 'pointer',
                        borderRadius: '15px',
                        padding: '2vh 4vh',
                        fontFamily: 'Nunito Sans',
                        width: '22.5vw',
                        fontSize: '19px'}}
                        onClick={() => {
                          /* @ts-ignore */
                          navigator.clipboard.writeText(item[1])
                        }}>
                        <Stack spacing={2} direction='row'>
                          {/* @ts-ignore */}
                          <img src={addressKeys[item[0]]} alt={`${item[0]}`} style={{
                            height: '27px',
                            width: '27px'
                          }}/>
                          {/* @ts-ignore */}
                          <p>{truncateAddress(item[1])}</p>
                        </Stack>
                      </button></Tooltip>}</>
                    })}
                  </Grid>
                </MoreWrapper>
              </Stack>
            </DetailsWrapper>
          </Stack>
        </Wrapper>
      </Stack>
    </walletContext.Provider>
  )
}

export default App;