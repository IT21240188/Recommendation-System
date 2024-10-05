import React from 'react';
import {
    MDBFooter,
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBIcon,
    MDBInput
} from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';

const FooterC = () => {
    return (
        <MDBFooter bgColor='light' className='text-center text-white text-lg-left'>
            <MDBContainer className='p-4 pb-0'>
                <form action=''>
                    <MDBRow className='d-flex justify-content-center'>
                        <MDBCol size='auto' className='mb-4 mb-md-0'>
                            
                        </MDBCol>

                        <MDBCol size='auto' className='mb-4 mb-md-0'>
                            <MDBBtn outline color='light'>
                                Subscribe
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </form>
            </MDBContainer>

            <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                &copy; {new Date().getFullYear()} Copyright:{' '}
                <a className='text-white' href='https://mdbootstrap.com/'>
                    bookStore.lk
                </a>
            </div>
        </MDBFooter>
    )
}

export default FooterC
