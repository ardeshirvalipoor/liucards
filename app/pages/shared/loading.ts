import { SVG } from "../../base/components/native/svg";

export const Loading = (color = '#FF156D88', width = 100) => {
    // Define the opacity levels and their corresponding delays
    const opacities = [0.7, 0.55, 0.4, 0.25, 0.1];
    const delays = [0, 0.05, 0.1, 0.15, 0.2]; // in seconds

    const radius = 15; // Radius of the circles
    const startCx = 35; // Starting x-coordinate
    const endCx = 165; // Ending x-coordinate
    const dur = "1.6s"; // Duration of the animation
    const keySplines = "0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"; // Easing for the cx animation

    let contents = ''; // Initialize SVG content string

    // Generate SVG circles with animations using a for loop
    for (let i = 0; i < opacities.length; i++) {
        const delay = delays[i];
        const finalOpacity = opacities[i];

        contents += `
            <circle fill="${color}" stroke-width="5" r="${radius}" cx="${startCx}" cy="100" opacity="0">
                <!-- Opacity animation: cycles from 0 to finalOpacity and back to 0 -->
                <animate 
                    attributeName="opacity" 
                    values="0;${finalOpacity};0" 
                    dur="${dur}" 
                    repeatCount="indefinite" 
                    begin="${delay + 1}s" 
                />
                
                <!-- Horizontal bouncing animation -->
                <animate 
                    attributeName="cx" 
                    calcMode="spline" 
                    dur="${dur}" 
                    values="${startCx};${endCx};${endCx};${startCx};${startCx}" 
                    keySplines="${keySplines}" 
                    repeatCount="indefinite" 
                    begin="${delay}s" 
                />
            </circle>
        `;
    }

    // Define the viewBox to ensure all animations are visible
    const viewBox = '0 75 200 50';

    // Create the SVG using the helper function
    const base = SVG(contents, viewBox);

    // Apply CSS classes for sizing
    base.cssClass({
        width: `${width}px`,
        height: `${width / 2}px`,
    });

    return base;
};
