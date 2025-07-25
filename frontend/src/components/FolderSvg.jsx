const FolderSvg = ({ fill = "white" , ...props}) => (
    <svg  {...props} width="16" height="16" viewBox="0 0 16 16" fill="transparent" xmlns="http://www.w3.org/2000/svg">

        <path d="M14.6668 12.6667C14.6668 13.0203 14.5264 13.3594 14.2763 13.6095C14.0263 13.8595
         13.6871 14 13.3335 14H2.66683C2.31321 14 1.97407 13.8595 1.72402 13.6095C1.47397 13.3594 
         1.3335 13.0203 1.3335 12.6667V3.33333C1.3335 2.97971 1.47397 2.64057 1.72402 2.39052C1.97407
          2.14048 2.31321 2 2.66683 2H6.00016L7.3335 4H13.3335C13.6871 4 14.0263 4.14048 14.2763 
          4.39052C14.5264 4.64057 14.6668 4.97971 14.6668 5.33333V12.6667Z" stroke={fill}
          strokeOpacity="0.92" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>

        <path d="M8 7.33301V11.333" stroke={fill} strokeOpacity="0.92" strokeWidth="1.33333"
         strokeLinecap="round" strokeLinejoin="round"/>

        <path d="M6 9.33301H10" stroke={fill} strokeOpacity="0.92" strokeWidth="1.33333"
        strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
);

export default FolderSvg;
