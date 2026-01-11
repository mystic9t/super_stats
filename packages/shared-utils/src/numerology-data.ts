
export const LIFE_PATH_MEANINGS: Record<number, string> = {
    1: "The Leader: You are a born pioneer, independent and original. Your path is one of innovation and standing on your own two feet. You are ambitious and have the drive to turn ideas into reality.",
    2: "The Mediator: You are the diplomat, sensitive and cooperative. Your strength lies in bringing people together and creating harmony. You are intuitive and supportive, often the power behind the throne.",
    3: "The Creative: You are the communicator, expressive and optimistic. You bring joy and inspiration to others through your artistic talents and social nature. Your path is to express yourself freely.",
    4: "The Builder: You are the rock, practical and disciplined. You build solid foundations for the future through hard work and reliability. You value security and order.",
    5: "The Adventurer: You are the free spirit, versatile and energetic. You thrive on change, variety, and freedom. Your path is to experience life fully and adapt to new situations.",
    6: "The Nurturer: You are the responsible one, caring and harmonious. You are often the heart of the family or community, providing support and love. Your path is one of service and responsibility.",
    7: "The Seeker: You are the analyst, spiritual and intuitive. You seek the deeper truths of life and enjoy solitude to reflect. Your path is one of wisdom and understanding.",
    8: "The Powerhouse: You are the executive, ambitious and authoritative. You understand the material world and how to achieve success. Your path is to master the physical and financial realms.",
    9: "The Humanitarian: You are the compassionate soul, generous and idealistic. You want to make the world a better place. Your path is one of universal love and completion.",
    11: "The Master Illuminator: You possess great intuition and spiritual insight. Your path is to inspire and uplift humanity, bridging the spiritual and material worlds.",
    22: "The Master Builder: You have the vision to dream big and the practical skills to make it happen. Your path is to build something lasting that benefits the world on a large scale.",
    33: "The Master Teacher: You are the essence of compassionate service. Your path is to guide and heal others through your selfless love and spiritual wisdom."
};

export const DESTINY_MEANINGS: Record<number, string> = {
    1: "You are destined to lead and innovate. Your potential is best realized when you take charge and blaze your own trail.",
    2: "You are destined to be a peacemaker. Your potential is best realized through collaboration and fostering harmonious relationships.",
    3: "You are destined to inspire. Your potential is best realized through creative self-expression and spreading joy.",
    4: "You are destined to build. Your potential is best realized through steady progress, organization, and creating tangible results.",
    5: "You are destined to explore. Your potential is best realized by embracing change and finding freedom in new experiences.",
    6: "You are destined to serve. Your potential is best realized by caring for others and creating a supportive environment.",
    7: "You are destined to discover. Your potential is best realized through analysis, research, and uncovering hidden truths.",
    8: "You are destined to succeed. Your potential is best realized by managing resources and achieving recognition in the material world.",
    9: "You are destined to give. Your potential is best realized through philanthropy, compassion, and letting go of the past."
};

export const getMeaning = (num: number, type: 'lifePath' | 'destiny'): string => {
    const map = type === 'lifePath' ? LIFE_PATH_MEANINGS : DESTINY_MEANINGS;
    return map[num] || "A unique vibration of mystery and potential waiting to be unlocked.";
};
