if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "D:/FPT/SEP490/OrchidLabMobile/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/6f1t3n4l/obj/x86_64/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/FPT/SEP490/OrchidLabMobile/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

