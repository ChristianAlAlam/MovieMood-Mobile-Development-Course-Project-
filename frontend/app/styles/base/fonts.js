import { useFonts } from 'expo-font';

export const useAppFonts = () => {
    const [fontsLoaded] = useFonts ({

        'Inter_18pt-Bold': require('../../../assets/fonts/Inter/Inter_18pt-Bold.ttf'),
        'Inter_18pt-Regular': require('../../../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
        'Inter_18pt-Italic': require('../../../assets/fonts/Inter/Inter_18pt-Italic.ttf'),
        'Inter_18pt-SemiBold': require('../../../assets/fonts/Inter/Inter_18pt-SemiBold.ttf'),
        'Inter_18pt-Medium': require('../../../assets/fonts/Inter/Inter_18pt-Medium.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-Italic': require('../../../assets/fonts/Poppins/Poppins-Italic.ttf'),
        'Poppins-SemiBold': require('../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        'Roboto-Bold': require('../../../assets/fonts/Roboto/Roboto-Bold.ttf'),
        'Roboto-Medium': require('../../../assets/fonts/Roboto/Roboto-Medium.ttf'),
        'Roboto-SemiBold': require('../../../assets/fonts/Roboto/Roboto-SemiBold.ttf'),
    });

    return fontsLoaded;
};

export default useAppFonts;