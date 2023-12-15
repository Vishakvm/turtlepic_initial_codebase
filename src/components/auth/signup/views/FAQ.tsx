import { Accordion, AccordionDetails, AccordionSummary, styled, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(11),
}));

const FAQAccoridion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  padding: theme.spacing(4),
  borderRadius: '4px',
  margin: '30px auto 0px auto !important',
  width: '80%',
  marginBottom: theme.spacing(4),
  '& .MuiAccordionSummary-content': {
    justifyContent: 'start',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export default function FAQ() {
  return (
    <FAQContainer>
      <Typography variant="h2" align="center" sx={{ marginBottom: '15px' }}>
        {' '}
        Frequently Asked Questions
      </Typography>
      <Typography variant="h3" align="center" sx={{ marginBottom: '50px' }}>
        Have questions? We’re here to help.
      </Typography>
      <FAQAccoridion sx={{ maxWidth: '1074px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            About TurtlePic
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What can I use TurtlePic for?
          </Typography>
          <Typography variant="h5" mt={3}>
            TurtlePic is a photo sharing platform. It can be used by anyone who is hosting /
            managing an event and wishes to share the photos with the guests.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Who is TurtlePic for?
          </Typography>
          <Typography variant="h5" mt={3}>
            Apart from individual users who want to share photos from a personal event, TurtlePic
            also serves businesses of all sizes. It can be used by photographers, event managers,
            schools, colleges, clubs, societies etc.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
      <FAQAccoridion sx={{ maxWidth: '1074px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Face Recognition
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4">How can my guests use face recognition?</Typography>
          <Typography variant="h5" mt={3}>
            1 selfie is all it takes to find any person's photos in your published event. Whether a
            guest is present in 1% of photos or 99%, it doesn't take more than a few seconds to
            filter their photos from the entire event
          </Typography>
          <Typography variant="h4" mt={3}>
            How accurate is TurtlePic Face recognition?
          </Typography>
          <Typography variant="h5" mt={3}>
            TurtlePic Face recognition is very robust and offers more than 99% accuracy when finding
            your photos. It even finds you in blurry photos, large group photos, photos with the
            person's side faces and many more instances where you'd be blown away by AI's accuracy
            to find you.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
      <FAQAccoridion sx={{ maxWidth: '1074px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Pre-registration{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            How can I pre-register my guests?
          </Typography>
          <div>
            <Typography my={3} variant="h5">
              "You can share the pre-registration QR code or URL of your newly created event on
              TurtlePic with the guests. From there, it's an easy 3 step process to register for all
              your guests.{' '}
            </Typography>
            <Typography variant="h5">1) Enter name and email ID </Typography>
            <Typography variant="h5">2) Click a selfie</Typography>
            <Typography variant="h5">
              3) Enter mobile number (for Whatsapp notification of event when it's published)"
            </Typography>
          </div>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Is there a way to share my event with all the guests in one go?{' '}
          </Typography>
          <Typography my={3} variant="h5">
            TurtlePic offers inbuilt Whatsapp and email sharing of your published event. Skip the
            hassle of sending the event link to each person / group seperately and send it to all
            your registered guests in a single click.
          </Typography>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            How can I make use of QR code for pre-registration?{' '}
          </Typography>
          <Typography my={3} variant="h5">
            Each event you create has a unique QR code for it by default. You can print the high
            resolution photo of the QR and share it with your guests along with event invite. You
            can also put the printed standees with QR code at your event so the guests can scan and
            register at the same.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
      <FAQAccoridion sx={{ maxWidth: '1074px', marginBottom: '90px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            TurtlePic Agency vs TurtlePic Individual{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What are the add on benefits available in agency account?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            "In agency account, if you complete your KYC, you get to enjoy following features:
          </Typography>
          <Typography mt={3} variant="h5">
            1) Create free client events and share unlimited photos with your client.
          </Typography>
          <Typography mt={3} variant="h5">
            2) Invite team members on TurtlePic and collaborate seamlessly in your agency workspace.
          </Typography>
          <Typography mt={3} variant="h5">
            3) Free marketing of your brand in all published events.{' '}
          </Typography>
          <Typography mt={3} variant="h5">
            4) Watermark images so your brand is remembered by all the viewers Much more to come."
          </Typography>

          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            How to unlock the added benefits of agency account?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            Just by completing the KYC user can unlock the benefits associated with agency account.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What are client events?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            If you have a KYC verified agency account, then you can create an event on behalf of
            your client and share it with them. This event can have unlimited photos and can be
            downloaded by the client as well. The access of "Client Events" is limited to 14 days
            only.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            How can adding team members can help my business?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            By adding team members, you can save up on money and time. All your employees can work
            in a single workspace dedicated to your agency. They can work paralelly and you don't
            need to purchase different plans for each team member account.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What is a watermark?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            By enabling watermark, the logo of your brand is added in the bottom right corner of
            each image you publish. Your brand identity stays with the guests who view, download or
            share the photos published by your agency.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
      <FAQAccoridion sx={{ maxWidth: '1074px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Data Security
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            How secure is my data on TurtlePic?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            Your data is always secure at TurtlePic. Your events can only be viewed by you and the
            people you invite to view the event. Enable the privacy setting "Only registered users
            can view" to keep record of each viewer of your event.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What will happen to my data after my plan expires?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            TurtlePic keeps your account and all the data in it, safe for 2 weeks even after expiry,
            in case you wish to recover your account. Post that, all the photos inside that account
            are automatically deleted from our servers.
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What would be the resolution of the photos that my guests download?{' '}
          </Typography>
          <Typography variant="h5" mt={3}>
            Your guests get to download the exact photos as you upload. We never downscale your high
            resoltion photos while any viewer downloads them.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
      <FAQAccoridion sx={{ maxWidth: '1074px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: 'start' }}
        >
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            Privacy
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '20px' }}>
          <Typography variant="h4" sx={{ alignSelf: 'flex-start' }}>
            What are different privacy controls?{' '}
          </Typography>

          <Typography variant="h5" mt={3}>
            "TurtlePic values your privacy and uses the best industry practises to ensure that.
            Following are the different controls you can enable to secure your data while sharing:
          </Typography>
          <Typography mt={3} variant="h4" sx={{ alignSelf: 'flex-start' }}>
            1) Right click protection - When enabled, you can restrict right click saving of photos.
          </Typography>
          <Typography variant="h5" mt={3}>
            2) Mandatory Selfie Search - When enabled, guests can only see the photos they are
            present in. To see their photos, they would need to use our Face recognition.
          </Typography>
          <Typography variant="h5" mt={3}>
            3) Only registered users can view - When enabled, you can keep track of each user with
            their email ID, who viewed your gallery.
          </Typography>
          <Typography variant="h5" mt={3}>
            4) Allow download - Enable or disable the download facility for the guests as per your
            choice.
          </Typography>
        </AccordionDetails>
      </FAQAccoridion>
    </FAQContainer>
  );
}
